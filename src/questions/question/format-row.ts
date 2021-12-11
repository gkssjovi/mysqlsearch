import {FormatRow, formatRowOptions} from '../../format-row';

import {Question} from './index';
import {QuestionNode} from '../question-node';
import {colorize, Colors} from '../../colors';
import {getState, setState} from '../../state';
import {QuestionList} from '../question-list';
import {Questions} from '..';

export class QuestionFormatRow extends Question {
    constructor(index: keyof QuestionList, params = {}) {
        super(index, params);

        this.message = 'format-row';
    }

    render() {
        const state = getState();

        if (!state.formatRow) {
            return this.message;
        }

        return this.message + colorize(` (${state.formatRow})`, Colors.Dim);
    }

    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }

    node(that: Questions, ql: QuestionList) {
        const {formatRow} = getState();

        return new QuestionNode(
            this.index,
            {
                type: 'list',
                default: formatRow,
                message: this.message,
                choices: [...formatRowOptions],
            },
            ({value}, node) => {
                if (!node.parent) {
                    return;
                }

                setState({formatRow: value as FormatRow});
                that.setCurrent(node.parent.index);
                node.parent.updateChoiceMenu(this.index, this.render());
                node.updateDefault(value);
            }
        );
    }
}
