/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {Options, options, NonStateOptions, getOption} from './options';
import {themeOptions, Theme} from './theme';
import {FormatRow, formatRowOptions} from './format-row';
import {FormatCell, formatCellOptions} from './format-cell';
import {ConfigValue, getConfig, setConfig} from './config';

export type State = Omit<Options, keyof NonStateOptions> & {
    search: string;
};

let state: State;

export const createState = (): State => {
    const {database} = options;

    const search = typeof options._[0] !== 'undefined' ? String(options._[0]) : '';

    state = {
        search,
        host: getOption('host', getConfig('host', 'localhost') as string),
        database: getOption('database', getConfig('database', null) as string),
        user: getOption('user', getConfig('user', 'root') as string),
        password: getOption('password', getConfig('password') as string),
        port: getOption(
            'port',
            getConfig('port', 3306) as number,
            (value) => !isNaN(parseInt(String(value)))
        ),
        limit: getOption(
            'limit',
            getConfig('limit', 0) as number,
            (value) => !isNaN(parseInt(String(value)))
        ),
        formatRow: getOption(
            'formatRow',
            getConfig('formatRow', FormatRow.DEFAULT) as FormatRow,
            (value) => formatRowOptions.includes(value)
        ),
        formatCell: getOption(
            'formatCell',
            getConfig('formatCell', FormatCell.MATCH) as FormatCell,
            (value) => formatCellOptions.includes(value)
        ),
        trimMatchContext: getOption(
            'trimMatchContext',
            getConfig('trimMatchContext', false) as boolean
        ),
        table: getOption('table', getConfig('table', '') as string),
        theme: getOption('theme', getConfig('theme', Theme.DEFAULT) as Theme, (value) =>
            themeOptions.includes(value)
        ),
        exit: getOption('exit', false),
    };

    return state;
};

export const setState = (newState: Partial<State>) => {
    state = {
        ...state,
        ...newState,
    };

    const config = getConfig();
    for (const key in state) {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
            const value = (state as any)[key];
            if (Object.prototype.hasOwnProperty.call(config, key)) {
                setConfig(key, value as ConfigValue);
            }
        }
    }
};

export const getState = () => {
    return state;
};
