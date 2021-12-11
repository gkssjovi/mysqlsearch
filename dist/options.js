"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOption = exports.options = void 0;
const yargs_1 = __importDefault(require("yargs"));
const theme_1 = require("./theme");
const format_row_1 = require("./format-row");
const format_cell_1 = require("./format-cell");
exports.options = yargs_1.default
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
    describe: `Display row formats <${format_row_1.formatRowOptions.join(', ')}>`,
    type: 'string',
    demandOption: false,
})
    .option('format-cell', {
    alias: 'c',
    describe: `Display cell formats <${format_cell_1.formatCellOptions.join(', ')}>`,
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
    describe: `Display with different style <${theme_1.themeOptions.join(', ')}>`,
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
}).argv;
const getOption = (option, defaultValue, validateCallback) => {
    if (typeof exports.options[option] === 'undefined') {
        return defaultValue;
    }
    if (typeof validateCallback !== 'undefined') {
        if (!validateCallback(exports.options[option])) {
            return defaultValue;
        }
    }
    return exports.options[option];
};
exports.getOption = getOption;
