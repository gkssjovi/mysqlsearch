import {themeOptions, Theme} from '../../theme';

import {Question} from './index';
import {QuestionNode} from '../question-node';
import {colorize, Colors} from '../../colors';
import {getState, setState} from '../../state';
import {QuestionList} from '../question-list';
import {Questions} from '..';

export class QuestionTheme extends Question {
    constructor(index: keyof QuestionList, params = {}) {
        super(index, params);

        this.message = 'theme';
    }

    render() {
        const state = getState();

        if (!state.theme) {
            return this.message;
        }

        return this.message + colorize(` (${state.theme})`, Colors.Dim);
    }

    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }

    node(that: Questions, ql: QuestionList) {
        const {theme} = getState();
        return new QuestionNode(
            this.index,
            {
                type: 'list',
                default: theme,
                message: this.message,
                choices: [...themeOptions],
            },
            ({value}, node) => {
                if (!node.parent) {
                    return;
                }
                setState({theme: value as Theme});
                that.setCurrent(node.parent.index);
                node.parent.updateChoiceMenu(this.index, this.render());
                node.updateDefault(value);
            }
        );
    }
}
