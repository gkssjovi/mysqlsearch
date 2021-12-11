import {Question} from './index';
import {QuestionNode} from '../question-node';
import {colorize, Colors} from '../../colors';
import {getState, setState} from '../../state';
import {FormatCell, formatCellOptions} from '../../format-cell';
import {QuestionList} from '../question-list';
import {Questions} from '..';

export class QuestionFormatCell extends Question {
    constructor(index: keyof QuestionList, params = {}) {
        super(index, params);

        this.message = 'format-cell';
    }

    render() {
        const state = getState();

        if (!state.formatCell) {
            return this.message;
        }

        return this.message + colorize(` (${state.formatCell})`, Colors.Dim);
    }

    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }

    node(that: Questions, ql: QuestionList) {
        const {formatCell} = getState();
        return new QuestionNode(
            this.index,
            {
                type: 'list',
                default: formatCell,
                message: this.message,
                choices: [...formatCellOptions],
            },
            ({value}, node) => {
                if (!node.parent) {
                    return;
                }

                setState({formatCell: value as FormatCell});
                that.setCurrent(node.parent.index);
                node.parent.updateChoiceMenu(this.index, this.render());
                node.updateDefault(value);
            }
        );
    }
}
