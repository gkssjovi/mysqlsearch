#!/usr/bin/env node

import moment from 'moment';
import {colorize, Colors} from './colors';
import {ThemeType, ThemeSeparatorPostion, createTheme} from './theme';
import {FormatRow} from './format-row';
import {createState, getState} from './state';
import {output, regex} from './helpers';
import {redirected} from './const';
import {Questions} from './questions';
import {size} from './size';
import {FormatCell} from './format-cell';
import {strlen} from 'printable-characters';
import {createConnection, MysqlRow} from './mysql';

const main = async () => {
    let state = createState();

    let startWithSearch = state.search.length > 0;

    const questions = new Questions('search');

    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (!startWithSearch) {
            const currentQuestion = questions.getCurrent();
            const response = await questions.prompt(currentQuestion.value);
            const repeat = currentQuestion.sendResponse(response);

            state = getState();

            if (repeat) {
                continue;
            }
        }
        startWithSearch = false;

        try {
            const connection = await createConnection();

            let foundInTablesCount = 0;
            const [tables, [tablesHeader]] = await connection.query<MysqlRow[]>('SHOW TABLES');

            let tableFound = false;

            for (const table of tables) {
                const tableName = table[tablesHeader.name] as string;

                if (state.table && state.table !== tableName) {
                    continue;
                }

                tableFound = true;

                const [fields, [fieldsHeader]] = await connection.query<MysqlRow[]>(
                    `SHOW COLUMNS FROM ${connection.escapeId(tableName)}`
                );

                const tail = fields
                    .map(
                        (field: MysqlRow) =>
                            `\`${field[fieldsHeader.name] as string}\` LIKE ${connection.escape(
                                '%' + state.search + '%'
                            )}`
                    )
                    .join(' OR ');

                const sql =
                    `SELECT * FROM ${connection.escapeId(tableName)} WHERE ` +
                    tail +
                    (state.limit > 0 ? `LIMIT ${state.limit}` : '');

                const [result, [resultHeader]] = await connection.query<MysqlRow[]>(sql);

                if (result.length > 0) {
                    foundInTablesCount++;
                    let sizes: CellSize[] = Array<CellSize>(Object.keys(result[0]).length).fill(
                        size.create(0, 0)
                    );
                    let header = Object.keys(result[0]);
                    const stay: Record<number, boolean> = {};
                    const rows = [];

                    for (const row of result) {
                        const currentRow = [];
                        for (let index = 0; index < header.length; index++) {
                            const column = header[index];
                            const columnSplit = [column];

                            let rawValue = row[column] as unknown;

                            const rawToString = Object.prototype.toString.call(rawValue) as string;

                            if (rawToString === '[object Date]') {
                                rawValue = moment(rawValue as Date).format('YYYY-MM-DD HH:mm:ss');
                            } else if (rawValue == null) {
                                rawValue = colorize(String(rawValue), Colors.Dim);
                            } else if (typeof rawValue === 'number') {
                                rawValue = colorize(String(rawValue), Colors.FgCyan);
                            }

                            const tabSize = '    ';
                            const value = String(rawValue)
                                .replace(/\r/gim, '')
                                .replace(/\t/gim, tabSize);

                            let valueSplit = value.split('\n');
                            if (state.formatCell !== FormatCell.FULL) {
                                let matchFound = false;
                                valueSplit = valueSplit.filter((val, index, arr) => {
                                    if (regex(state.search).test(val)) {
                                        matchFound = true;
                                        return true;
                                    }
                                    if (!matchFound && index === arr.length - 1) {
                                        return true;
                                    }
                                    return false;
                                });

                                if (state.formatCell === FormatCell.MATCH_ONE) {
                                    valueSplit = valueSplit.filter((val, index) => index == 0);
                                }
                            }

                            const valueMultiline = valueSplit.map((val) => {
                                let valueColorized = val.replace(
                                    regex(state.search),
                                    colorize('$&', Colors.FgRed)
                                );

                                if (state.trimMatchContext) {
                                    const match = val.match(
                                        regex(state.search, '(\\w+)?', '(\\w+)?')
                                    );
                                    if (match) {
                                        val = `${match[0]}`;
                                        const valueMatchColorized = val.replace(
                                            regex(state.search),
                                            colorize('$&', Colors.FgRed)
                                        );
                                        valueColorized = valueMatchColorized;
                                    }
                                }

                                return [valueColorized, strlen(val)];
                            });

                            sizes[index] = size.max(size.get(columnSplit, true), sizes[index]);
                            if (state.trimMatchContext) {
                                sizes[index] = size.max(
                                    size.get(
                                        valueMultiline.map((val) => val[0] as string),
                                        true
                                    ),
                                    sizes[index]
                                );
                            } else {
                                sizes[index] = size.max(size.get(valueSplit, true), sizes[index]);
                            }

                            const currentColumn = {
                                value: valueMultiline,
                            };

                            currentRow.push(currentColumn);

                            if (
                                regex(state.search).test(value) ||
                                state.formatRow === FormatRow.FULL ||
                                (state.formatRow === FormatRow.DEFAULT && index == 0)
                            ) {
                                stay[index] = true;
                            }
                        }

                        rows.push(currentRow);
                    }

                    header = header.filter((_, index) => stay[index] == true);
                    sizes = sizes.filter((_, index) => stay[index] == true);
                    const theme = createTheme(sizes, state.theme);

                    output.print(`◎ ${colorize(tableName, Colors.FgGreen)}`);
                    const headerLIne =
                        `${theme.getSeparator(ThemeSeparatorPostion.LEFT)} ` +
                        header
                            .map(
                                (item, index) =>
                                    `${' '.repeat(sizes[index][0] - item.length)}${colorize(
                                        item,
                                        Colors.FgYellow
                                    )}`
                            )
                            .join(` ${theme.getSeparator(ThemeSeparatorPostion.MIDDLE)} `) +
                        ` ${theme.getSeparator(ThemeSeparatorPostion.RIGHT)}`;

                    theme.print(ThemeType.TOP);
                    output.print(headerLIne);
                    theme.print(ThemeType.MIDDLE);

                    for (let index = 0; index < rows.length; index++) {
                        const row = rows[index].filter((_, index) => stay[index] == true);
                        const rowHeight = Math.max(...row.map((c, ci) => sizes[ci][1]));

                        for (let heightIndex = 0; heightIndex < rowHeight; heightIndex++) {
                            output.write(`${theme.getSeparator(ThemeSeparatorPostion.LEFT)} `);
                            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                                const column = row[columnIndex];
                                const {value} = column;
                                const currentSize = sizes[columnIndex];

                                if (typeof value[heightIndex] !== 'undefined') {
                                    const line = value[heightIndex][0];
                                    const lineLength = Number(value[heightIndex][1]);

                                    output.write(' '.repeat(currentSize[0] - lineLength));
                                    output.write(line);
                                } else {
                                    output.write(' '.repeat(currentSize[0]));
                                }

                                if (columnIndex < row.length - 1) {
                                    output.write(
                                        ` ${theme.getSeparator(ThemeSeparatorPostion.MIDDLE)} `
                                    );
                                }
                            }
                            output.write(` ${theme.getSeparator(ThemeSeparatorPostion.RIGHT)}`);
                            output.write('\n');
                        }
                    }
                    theme.print(ThemeType.BOTTOM);
                    output.print('');
                }
            }

            if (!tableFound && state.table) {
                output.print(colorize(`Table ${state.table} was not found.`, Colors.FgRed));
            } else if (foundInTablesCount == 0) {
                output.print(
                    `No records found${state.table ? ` in table "${state.table}"` : ''}.`,
                    Colors.FgYellow
                );
            }
            await connection.end();
        } catch (e) {
            output.print((e as Error).message, Colors.FgRed);
        } finally {
        }

        state.search = '';
        if (redirected || state.exit) {
            break;
        }
    }
};

main().catch((err: Error) => {
    output.debug(err);
});
