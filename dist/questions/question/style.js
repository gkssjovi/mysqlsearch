"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionTheme = void 0;
const theme_1 = require("../../theme");
const index_1 = require("./index");
const question_node_1 = require("../question-node");
const colors_1 = require("../../colors");
const state_1 = require("../../state");
class QuestionTheme extends index_1.Question {
    constructor(index, params = {}) {
        super(index, params);
        this.message = 'theme';
    }
    render() {
        const state = (0, state_1.getState)();
        if (!state.theme) {
            return this.message;
        }
        return this.message + (0, colors_1.colorize)(` (${state.theme})`, colors_1.Colors.Dim);
    }
    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }
    node(that, ql) {
        const { theme: style } = (0, state_1.getState)();
        return new question_node_1.QuestionNode(this.index, {
            type: 'list',
            default: style,
            message: this.message,
            choices: [...theme_1.themeOptions],
        }, ({ value }, node) => {
            if (!node.parent) {
                return;
            }
            (0, state_1.setState)({ theme: value });
            that.setCurrent(node.parent.index);
            node.parent.updateChoiceMenu(this.index, this.render());
        });
    }
}
exports.QuestionTheme = QuestionTheme;
