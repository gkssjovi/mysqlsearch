#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const colors_1 = require("./colors");
const theme_1 = require("./theme");
const format_row_1 = require("./format-row");
const state_1 = require("./state");
const helpers_1 = require("./helpers");
const const_1 = require("./const");
const questions_1 = require("./questions");
const size_1 = require("./size");
const format_cell_1 = require("./format-cell");
const printable_characters_1 = require("printable-characters");
const mysql_1 = require("./mysql");
const main = async () => {
    let state = (0, state_1.createState)();
    let startWithSearch = state.search.length > 0;
    const questions = new questions_1.Questions('search');
    while (true) {
        if (!startWithSearch) {
            const currentQuestion = questions.getCurrent();
            const response = await questions.prompt(currentQuestion.value);
            const repeat = currentQuestion.sendResponse(response);
            state = (0, state_1.getState)();
            if (repeat) {
                continue;
            }
        }
        startWithSearch = false;
        try {
            const connection = await (0, mysql_1.createConnection)();
            let foundInTablesCount = 0;
            const [tables, [tablesHeader]] = await connection.query('SHOW TABLES');
            let tableFound = false;
            for (const table of tables) {
                const tableName = table[tablesHeader.name];
                if (state.table && state.table !== tableName) {
                    continue;
                }
                tableFound = true;
                const [fields, [fieldsHeader]] = await connection.query(`SHOW COLUMNS FROM ${connection.escapeId(tableName)}`);
                const tail = fields
                    .map((field) => `\`${field[fieldsHeader.name]}\` LIKE ${connection.escape('%' + state.search + '%')}`)
                    .join(' OR ');
                const sql = `SELECT * FROM ${connection.escapeId(tableName)} WHERE ` +
                    tail +
                    (state.limit > 0 ? `LIMIT ${state.limit}` : '');
                const [result, [resultHeader]] = await connection.query(sql);
                if (result.length > 0) {
                    foundInTablesCount++;
                    let sizes = Array(Object.keys(result[0]).length).fill(size_1.size.create(0, 0));
                    let header = Object.keys(result[0]);
                    const stay = {};
                    const rows = [];
                    for (const row of result) {
                        const currentRow = [];
                        for (let index = 0; index < header.length; index++) {
                            const column = header[index];
                            const columnSplit = [column];
                            let rawValue = row[column];
                            const rawToString = Object.prototype.toString.call(rawValue);
                            if (rawToString === '[object Date]') {
                                rawValue = (0, moment_1.default)(rawValue).format('YYYY-MM-DD HH:mm:ss');
                            }
                            else if (rawValue == null) {
                                rawValue = (0, colors_1.colorize)(String(rawValue), colors_1.Colors.Dim);
                            }
                            else if (typeof rawValue === 'number') {
                                rawValue = (0, colors_1.colorize)(String(rawValue), colors_1.Colors.FgCyan);
                            }
                            const tabSize = '    ';
                            const value = String(rawValue)
                                .replace(/\r/gim, '')
                                .replace(/\t/gim, tabSize);
                            let valueSplit = value.split('\n');
                            if (state.formatCell !== format_cell_1.FormatCell.FULL) {
                                let matchFound = false;
                                valueSplit = valueSplit.filter((val, index, arr) => {
                                    if ((0, helpers_1.regex)(state.search).test(val)) {
                                        matchFound = true;
                                        return true;
                                    }
                                    if (!matchFound && index === arr.length - 1) {
                                        return true;
                                    }
                                    return false;
                                });
                                if (state.formatCell === format_cell_1.FormatCell.MATCH_ONE) {
                                    valueSplit = valueSplit.filter((val, index) => index == 0);
                                }
                            }
                            const valueMultiline = valueSplit.map((val) => {
                                let valueColorized = val.replace((0, helpers_1.regex)(state.search), (0, colors_1.colorize)('$&', colors_1.Colors.FgRed));
                                if (state.trimMatchContext) {
                                    const match = val.match((0, helpers_1.regex)(state.search, '(\\w+)?', '(\\w+)?'));
                                    if (match) {
                                        val = `${match[0]}`;
                                        const valueMatchColorized = val.replace((0, helpers_1.regex)(state.search), (0, colors_1.colorize)('$&', colors_1.Colors.FgRed));
                                        valueColorized = valueMatchColorized;
                                    }
                                }
                                return [valueColorized, (0, printable_characters_1.strlen)(val)];
                            });
                            sizes[index] = size_1.size.max(size_1.size.get(columnSplit, true), sizes[index]);
                            if (state.trimMatchContext) {
                                sizes[index] = size_1.size.max(size_1.size.get(valueMultiline.map((val) => val[0]), true), sizes[index]);
                            }
                            else {
                                sizes[index] = size_1.size.max(size_1.size.get(valueSplit, true), sizes[index]);
                            }
                            const currentColumn = {
                                value: valueMultiline,
                            };
                            currentRow.push(currentColumn);
                            if ((0, helpers_1.regex)(state.search).test(value) ||
                                state.formatRow === format_row_1.FormatRow.FULL ||
                                (state.formatRow === format_row_1.FormatRow.DEFAULT && index == 0)) {
                                stay[index] = true;
                            }
                        }
                        rows.push(currentRow);
                    }
                    header = header.filter((_, index) => stay[index] == true);
                    sizes = sizes.filter((_, index) => stay[index] == true);
                    const theme = (0, theme_1.createTheme)(sizes, state.theme);
                    helpers_1.output.print(`◎ ${(0, colors_1.colorize)(tableName, colors_1.Colors.FgGreen)}`);
                    const headerLIne = `${theme.getSeparator(theme_1.ThemeSeparatorPostion.LEFT)} ` +
                        header
                            .map((item, index) => `${' '.repeat(sizes[index][0] - item.length)}${(0, colors_1.colorize)(item, colors_1.Colors.FgYellow)}`)
                            .join(` ${theme.getSeparator(theme_1.ThemeSeparatorPostion.MIDDLE)} `) +
                        ` ${theme.getSeparator(theme_1.ThemeSeparatorPostion.RIGHT)}`;
                    theme.print(theme_1.ThemeType.TOP);
                    helpers_1.output.print(headerLIne);
                    theme.print(theme_1.ThemeType.MIDDLE);
                    for (let index = 0; index < rows.length; index++) {
                        const row = rows[index].filter((_, index) => stay[index] == true);
                        const rowHeight = Math.max(...row.map((c, ci) => sizes[ci][1]));
                        for (let heightIndex = 0; heightIndex < rowHeight; heightIndex++) {
                            helpers_1.output.write(`${theme.getSeparator(theme_1.ThemeSeparatorPostion.LEFT)} `);
                            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                                const column = row[columnIndex];
                                const { value } = column;
                                const currentSize = sizes[columnIndex];
                                if (typeof value[heightIndex] !== 'undefined') {
                                    const line = value[heightIndex][0];
                                    const lineLength = Number(value[heightIndex][1]);
                                    helpers_1.output.write(' '.repeat(currentSize[0] - lineLength));
                                    helpers_1.output.write(line);
                                }
                                else {
                                    helpers_1.output.write(' '.repeat(currentSize[0]));
                                }
                                if (columnIndex < row.length - 1) {
                                    helpers_1.output.write(` ${theme.getSeparator(theme_1.ThemeSeparatorPostion.MIDDLE)} `);
                                }
                            }
                            helpers_1.output.write(` ${theme.getSeparator(theme_1.ThemeSeparatorPostion.RIGHT)}`);
                            helpers_1.output.write('\n');
                        }
                    }
                    theme.print(theme_1.ThemeType.BOTTOM);
                    helpers_1.output.print('');
                }
            }
            if (!tableFound && state.table) {
                helpers_1.output.print((0, colors_1.colorize)(`Table ${state.table} was not found.`, colors_1.Colors.FgRed));
            }
            else if (foundInTablesCount == 0) {
                helpers_1.output.print(`No records found${state.table ? ` in table "${state.table}"` : ''}.`, colors_1.Colors.FgYellow);
            }
            await connection.end();
        }
        catch (e) {
            helpers_1.output.print(e.message, colors_1.Colors.FgRed);
        }
        finally {
        }
        state.search = '';
        if (const_1.redirected || state.exit) {
            break;
        }
    }
};
main().catch((err) => {
    helpers_1.output.debug(err);
});
