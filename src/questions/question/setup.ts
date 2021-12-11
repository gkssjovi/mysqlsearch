import inquirer from 'inquirer';
import {Question, QuestionInterface} from './index';
import {QuestionNode} from '../question-node';
import {QuestionList} from '../question-list';
import {Questions} from '..';
import Choice from 'inquirer/lib/objects/choice';

export class QuestionSetup extends Question implements QuestionInterface {
    constructor(index: keyof QuestionList, params = {}) {
        super(index, params);

        this.message = 'setup';
    }

    render() {
        return this.message;
    }

    menu(): Partial<Choice> {
        return {
            name: this.render(),
            value: this.index,
        };
    }

    node(that: Questions, ql: QuestionList) {
        return new QuestionNode(
            this.index,
            {
                type: 'list',
                message: this.message,
                default: undefined,
                choices: [
                    ql.search.menu(),
                    // ql.query,
                    new inquirer.Separator(),
                    ql.formatRow.menu(),
                    ql.formatCell.menu(),
                    ql.trimMatchContext.menu(),
                    ql.theme.menu(),
                    ql.database.menu(),
                    ql.table.menu(),
                    ql.limit.menu(),
                ],
            },
            ({value}, node) => {
                if (value === ql.search.index) {
                    that.setCurrent(ql.search.index);
                }

                if (value === ql.limit.index) {
                    that.setCurrent(ql.limit.index);
                }

                if (value === ql.table.index) {
                    that.setCurrent(ql.table.index);
                }

                if (value === ql.database.index) {
                    that.setCurrent(ql.database.index);
                }

                if (value === ql.formatRow.index) {
                    that.setCurrent(ql.formatRow.index);
                }

                if (value === ql.formatCell.index) {
                    that.setCurrent(ql.formatCell.index);
                }

                if (value === ql.trimMatchContext.index) {
                    that.setCurrent(ql.trimMatchContext.index);
                }

                if (value === ql.theme.index) {
                    that.setCurrent(ql.theme.index);
                }

                return false;
            }
        );
    }
}
