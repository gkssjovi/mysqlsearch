import {Question, QuestionInterface} from './index';
import {setState} from '../../state';
import {QuestionNode} from '../question-node';
import {Questions} from '..';
import {QuestionList} from '../question-list';
import Choice from 'inquirer/lib/objects/choice';

export class QuestionSearch extends Question implements QuestionInterface {
    constructor(index: keyof QuestionList, params = {}) {
        super(index, params);

        this.message = 'search:';
        this.actions = {
            setup: ':setup',
            q: ':q',
        };
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
                type: 'input',
                message: this.message,
            },
            ({value}) => {
                const setupNode = that.getNode('setup');
                if (setupNode) {
                    setupNode.updateDefault(this.index);
                }

                if (value === this.actions.setup || value.trim().length == 0) {
                    that.setCurrent(ql.setup.index);
                    return false;
                }

                if (value === this.actions.q) {
                    process.exit(0);
                }

                if (value.trim().length == 0) {
                    return false;
                }

                setState({search: value});

                return true;
            }
        );
    }
}
