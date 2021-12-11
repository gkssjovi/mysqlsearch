"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionList = void 0;
const database_1 = require("./question/database");
const format_row_1 = require("./question/format-row");
const format_cell_1 = require("./question/format-cell");
const limit_1 = require("./question/limit");
const search_1 = require("./question/search");
const setup_1 = require("./question/setup");
const theme_1 = require("./question/theme");
const table_1 = require("./question/table");
const trim_match_context_1 = require("./question/trim-match-context");
exports.QuestionList = {
    search: new search_1.QuestionSearch('search'),
    setup: new setup_1.QuestionSetup('setup'),
    table: new table_1.QuestionTable('table'),
    formatRow: new format_row_1.QuestionFormatRow('formatRow'),
    formatCell: new format_cell_1.QuestionFormatCell('formatCell'),
    trimMatchContext: new trim_match_context_1.QuestionTrimMatchContext('trimMatchContext'),
    limit: new limit_1.QuestionLimit('limit'),
    theme: new theme_1.QuestionTheme('theme'),
    database: new database_1.QuestionDatabase('database'),
};
