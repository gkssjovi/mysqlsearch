import {Question} from './index';
import {createConnection, MysqlRow} from '../../mysql';
import {Colors, colorize} from '../../colors';
import {getState, setState, State} from '../../state';
import {QuestionNode} from '../question-node';
import fuzzy from 'fuzzy';
import {QuestionList} from '../question-list';
import {Questions} from '..';

export class QuestionDatabase extends Question {
    databases: string[] | null = null;

    constructor(index: keyof QuestionList, params = {}) {
        super(index, params);

        this.message = 'database';

        this.actions = {
            back: ':back',
        };
    }

    render() {
        const state = getState();
        if (!state.database) {
            return this.message;
        }
        return this.message + colorize(` (${state.database})`, Colors.Dim);
    }

    menu() {
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
                emptyText: `No databases found. \n  ${this.actions.back} -  to go back`,
                source: async (answers, input) => {
                    input = input || '';
                    return fuzzy.filter(input, await this.getDatabases()).map((el) => el.original);
                },
            },
            ({value}, node) => {
                if (!node.parent) {
                    return;
                }

                if (value === this.actions.back) {
                    that.setCurrent(node.parent.index);
                } else {
                    const state = getState();

                    setState({database: value});

                    node.parent.updateChoiceMenu(this.index, this.render());
                    that.setCurrent(node.parent.index);
                    node.updateDefault(value);

                    if (state.database !== value) {
                        setState({table: undefined});

                        const tableNode = that.getNode(ql.table.index);

                        if (tableNode) {
                            tableNode.updateDefault(undefined);
                            node.parent.updateChoiceMenu(ql.table.index, ql.table.render());
                        }
                    }
                }
            }
        );
    }

    async getDatabases() {
        if (this.databases) {
            return this.databases;
        }

        const connection = await createConnection();

        const [results] = await connection.query<MysqlRow[]>(`SHOW DATABASES`);
        const values = results.map((database) => Object.values(database)[0] as string);

        this.databases = [this.actions.back, ...values];

        await connection.end();

        return this.databases;
    }
}
