import {Question} from './index';
import {Colors, colorize} from '../../colors';
import {getState, setState} from '../../state';
import {QuestionNode} from '../question-node';
import {QuestionList} from '../question-list';
import {Questions} from '..';

export class QuestionLimit extends Question {
    constructor(index: keyof QuestionList, params = {}) {
        super(index, params);

        this.message = 'limit';
    }

    render() {
        const state = getState();

        if (!state.limit) {
            return this.message;
        }

        return this.message + colorize(` (${state.limit})`, Colors.Dim);
    }

    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }

    node(that: Questions, ql: QuestionList) {
        const {limit} = getState();
        return new QuestionNode(
            this.index,
            {
                type: 'input',
                message: this.message + ':',
                default: limit,
                validate: function (value) {
                    return isNaN(Number(value)) ? 'The value must be an integer' : true;
                },
            },
            ({value}, node) => {
                if (!node.parent) {
                    return;
                }
                setState({limit: Number(value)});

                node.setValue({default: Number(value)});
                node.parent.updateChoiceMenu(this.index, this.render());
                that.setCurrent(node.parent.index);
            }
        );
    }
}
