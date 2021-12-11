import {Question} from './index';
import {QuestionNode} from '../question-node';
import {colorize, Colors} from '../../colors';
import {getState, setState} from '../../state';
import {FormatCell, formatCellOptions} from '../../format-cell';
import {QuestionList} from '../question-list';
import {Questions} from '..';

export class QuestionTrimMatchContext extends Question {
    constructor(index: keyof QuestionList, params = {}) {
        super(index, params);

        this.message = 'trim-match-context';
    }

    render() {
        const state = getState();

        return this.message + colorize(` (${state.trimMatchContext ? 'Yes' : 'No'})`, Colors.Dim);
    }

    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }

    node(that: Questions, ql: QuestionList) {
        const {trimMatchContext} = getState();
        return new QuestionNode(
            this.index,
            {
                type: 'confirm',
                default: trimMatchContext ? 'Yes' : 'No',
                message: this.message,
            },
            ({value}, node) => {
                if (!node.parent) {
                    return;
                }

                setState({trimMatchContext: value ? true : false});
                that.setCurrent(node.parent.index);
                node.parent.updateChoiceMenu(this.index, this.render());
                node.updateDefault(value);
            }
        );
    }
}
