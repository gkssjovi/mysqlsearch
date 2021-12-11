import {QuestionDatabase} from './question/database';
import {QuestionFormatRow} from './question/format-row';
import {QuestionFormatCell} from './question/format-cell';
import {QuestionLimit} from './question/limit';
import {QuestionSearch} from './question/search';
import {QuestionSetup} from './question/setup';
import {QuestionTheme} from './question/theme';
import {QuestionTable} from './question/table';
import {QuestionTrimMatchContext} from './question/trim-match-context';

export interface QuestionList {
    search: QuestionSearch;
    // query:  'query';
    setup: QuestionSetup;
    table: QuestionTable;
    formatRow: QuestionFormatRow;
    formatCell: QuestionFormatCell;
    trimMatchContext: QuestionFormatCell;
    limit: QuestionLimit;
    theme: QuestionTheme;
    database: QuestionDatabase;
}

export const QuestionList = {
    search: new QuestionSearch('search'),
    // query: 'query:',
    setup: new QuestionSetup('setup'),
    table: new QuestionTable('table'),
    formatRow: new QuestionFormatRow('formatRow'),
    formatCell: new QuestionFormatCell('formatCell'),
    trimMatchContext: new QuestionTrimMatchContext('trimMatchContext'),
    limit: new QuestionLimit('limit'),
    theme: new QuestionTheme('theme'),
    database: new QuestionDatabase('database'),
};
