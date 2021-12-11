import yargs, {Arguments} from 'yargs';

import {themeOptions, Theme} from './theme';
import {FormatRow, formatRowOptions} from './format-row';
import {FormatCell, formatCellOptions} from './format-cell';

export interface NonStateOptions {
    _: Array<string | number>;
    $0: string;
    'format-row': FormatRow;
    'format-cell': FormatCell;
    'trim-match-context': boolean;
}

export interface Options extends NonStateOptions {
    host: string;
    database: string;
    port: number;
    user: string;
    password: string;
    table: string;
    formatRow: FormatRow;
    formatCell: FormatCell;
    trimMatchContext: boolean;
    theme: Theme;
    limit: number;
    exit: boolean;
}

export const options = yargs
    .command('<query>', 'Search query in database')
    .version('2.0')
    .option('host', {
        alias: 'h',
        describe: 'Hostname',
        type: 'string',
        demandOption: false,
    })
    .option('database', {
        alias: 'd',
        describe: 'Database',
        type: 'string',
        demandOption: false,
    })
    .option('port', {
        alias: 'P',
        describe: 'Port',
        type: 'number',
        demandOption: false,
    })
    .option('user', {
        alias: 'u',
        describe: 'User',
        type: 'string',
        demandOption: false,
    })
    .option('password', {
        alias: 'p',
        describe: 'Password',
        type: 'string',
        demandOption: false,
    })
    .option('format-row', {
        alias: 'r',
        describe: `Display row formats <${formatRowOptions.join(', ')}>`,
        type: 'string',
        demandOption: false,
    })
    .option('format-cell', {
        alias: 'c',
        describe: `Display cell formats <${formatCellOptions.join(', ')}>`,
        type: 'string',
        demandOption: false,
    })
    .option('trim-match-context', {
        describe: `Trim the match context.`,
        type: 'boolean',
        demandOption: false,
    })
    .option('theme', {
        alias: 's',
        describe: `Display with different style <${themeOptions.join(', ')}>`,
        type: 'string',
        demandOption: false,
    })
    .option('table', {
        alias: 't',
        describe: 'Search only in a specific table',
        type: 'string',
        demandOption: false,
    })
    .option('limit', {
        alias: 'l',
        describe: 'Limit the search results',
        type: 'number',
        demandOption: false,
    })
    .option('exit', {
        describe: 'Execute the script only once and then exit',
        type: 'boolean',
        demandOption: false,
    }).argv as Options & {[argName: string]: unknown};

export const getOption = <K extends keyof Options>(
    option: K,
    defaultValue: Options[K],
    validateCallback?: (value: Options[K]) => boolean
): Options[K] => {
    if (typeof options[option] === 'undefined') {
        return defaultValue;
    }

    if (typeof validateCallback !== 'undefined') {
        if (!validateCallback(options[option])) {
            return defaultValue;
        }
    }

    return options[option];
};
