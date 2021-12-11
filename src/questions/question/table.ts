import {Question, QuestionInterface} from './index';
import {createConnection, MysqlRow} from '../../mysql';
import {Colors, colorize} from '../../colors';
import {getState, setState} from '../../state';
import {QuestionNode} from '../question-node';
import fuzzy from 'fuzzy';
import Choice from 'inquirer/lib/objects/choice';
import {Questions} from '..';
import {QuestionList} from '../question-list';

export class QuestionTable extends Question implements QuestionInterface {
    tables: string[] | null;

    constructor(index: keyof QuestionList, params = {}) {
        super(index, params);

        this.message = 'table';
        this.actions = {
            none: ':none',
            back: ':back',
        };
    }

    render() {
        const state = getState();
        if (!state.table) {
            return this.message;
        }
        return this.message + colorize(` (${state.table})`, Colors.Dim);
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
                type: 'autocomplete',
                name: this.index,
                message: this.message,
                default: this.actions.back,
                emptyText: `No tables found. \n  ${this.actions.none} - to clear selection and go back \n  ${this.actions.back} - to go back`,
                source: async (answers, input: string) => {
                    input = input || '';
                    return fuzzy.filter(input, await this.getTables()).map((el) => el.original);
                },
            },
            ({value}, node) => {
                if (!node.parent) {
                    return;
                }

                if (value === this.actions.none) {
                    setState({table: undefined});
                    node.updateDefault(undefined);
                    node.parent.updateChoiceMenu(this.index, this.render());
                    that.setCurrent(node.parent.index);
                } else if (value === this.actions.back) {
                    that.setCurrent(node.parent.index);
                } else {
                    setState({table: value});
                    node.parent.updateChoiceMenu(this.index, this.render());
                    that.setCurrent(node.parent.index);
                    node.updateDefault(value);
                }

                node.parent.updateDefault(this.index);
            }
        );
    }

    async getTables() {
        if (this.tables) {
            return this.tables;
        }
        const connection = await createConnection();
        const [results] = await connection.query<MysqlRow[]>(`SHOW TABLES`);

        const values = results.map((table) => Object.values(table)[0] as string);

        this.tables = [this.actions.back, this.actions.none, ...values];

        await connection.end();

        return this.tables;
    }
}
