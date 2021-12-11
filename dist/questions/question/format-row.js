"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionFormatRow = void 0;
const format_row_1 = require("../../format-row");
const index_1 = require("./index");
const question_node_1 = require("../question-node");
const colors_1 = require("../../colors");
const state_1 = require("../../state");
class QuestionFormatRow extends index_1.Question {
    constructor(index, params = {}) {
        super(index, params);
        this.message = 'format-row';
    }
    render() {
        const state = (0, state_1.getState)();
        if (!state.formatRow) {
            return this.message;
        }
        return this.message + (0, colors_1.colorize)(` (${state.formatRow})`, colors_1.Colors.Dim);
    }
    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }
    node(that, ql) {
        const { formatRow } = (0, state_1.getState)();
        return new question_node_1.QuestionNode(this.index, {
            type: 'list',
            default: formatRow,
            message: this.message,
            choices: [...format_row_1.formatRowOptions],
        }, ({ value }, node) => {
            if (!node.parent) {
                return;
            }
            (0, state_1.setState)({ formatRow: value });
            that.setCurrent(node.parent.index);
            node.parent.updateChoiceMenu(this.index, this.render());
            node.updateDefault(value);
        });
    }
}
exports.QuestionFormatRow = QuestionFormatRow;
