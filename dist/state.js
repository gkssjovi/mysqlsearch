"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getState = exports.setState = exports.createState = void 0;
const options_1 = require("./options");
const theme_1 = require("./theme");
const format_row_1 = require("./format-row");
const format_cell_1 = require("./format-cell");
const config_1 = require("./config");
let state;
const createState = () => {
    const { database } = options_1.options;
    const search = typeof options_1.options._[0] !== 'undefined' ? String(options_1.options._[0]) : '';
    state = {
        search,
        host: (0, options_1.getOption)('host', (0, config_1.getConfig)('host', 'localhost')),
        database: (0, options_1.getOption)('database', (0, config_1.getConfig)('database', null)),
        user: (0, options_1.getOption)('user', (0, config_1.getConfig)('user', 'root')),
        password: (0, options_1.getOption)('password', (0, config_1.getConfig)('password')),
        port: (0, options_1.getOption)('port', (0, config_1.getConfig)('port', 3306), (value) => !isNaN(parseInt(String(value)))),
        limit: (0, options_1.getOption)('limit', (0, config_1.getConfig)('limit', 0), (value) => !isNaN(parseInt(String(value)))),
        formatRow: (0, options_1.getOption)('formatRow', (0, config_1.getConfig)('formatRow', format_row_1.FormatRow.DEFAULT), (value) => format_row_1.formatRowOptions.includes(value)),
        formatCell: (0, options_1.getOption)('formatCell', (0, config_1.getConfig)('formatCell', format_cell_1.FormatCell.MATCH), (value) => format_cell_1.formatCellOptions.includes(value)),
        trimMatchContext: (0, options_1.getOption)('trimMatchContext', (0, config_1.getConfig)('trimMatchContext', false)),
        table: (0, options_1.getOption)('table', (0, config_1.getConfig)('table', '')),
        theme: (0, options_1.getOption)('theme', (0, config_1.getConfig)('theme', theme_1.Theme.DEFAULT), (value) => theme_1.themeOptions.includes(value)),
        exit: (0, options_1.getOption)('exit', false),
    };
    return state;
};
exports.createState = createState;
const setState = (newState) => {
    state = Object.assign(Object.assign({}, state), newState);
    const config = (0, config_1.getConfig)();
    for (const key in state) {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
            const value = state[key];
            if (Object.prototype.hasOwnProperty.call(config, key)) {
                (0, config_1.setConfig)(key, value);
            }
        }
    }
};
exports.setState = setState;
const getState = () => {
    return state;
};
exports.getState = getState;
