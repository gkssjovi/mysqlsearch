"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionFormatCell = void 0;
const index_1 = require("./index");
const question_node_1 = require("../question-node");
const colors_1 = require("../../colors");
const state_1 = require("../../state");
const format_cell_1 = require("../../format-cell");
class QuestionFormatCell extends index_1.Question {
    constructor(index, params = {}) {
        super(index, params);
        this.message = 'format-cell';
    }
    render() {
        const state = (0, state_1.getState)();
        if (!state.formatCell) {
            return this.message;
        }
        return this.message + (0, colors_1.colorize)(` (${state.formatCell})`, colors_1.Colors.Dim);
    }
    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }
    node(that, ql) {
        const { formatCell } = (0, state_1.getState)();
        return new question_node_1.QuestionNode(this.index, {
            type: 'list',
            default: formatCell,
            message: this.message,
            choices: [...format_cell_1.formatCellOptions],
        }, ({ value }, node) => {
            if (!node.parent) {
                return;
            }
            (0, state_1.setState)({ formatCell: value });
            that.setCurrent(node.parent.index);
            node.parent.updateChoiceMenu(this.index, this.render());
            node.updateDefault(value);
        });
    }
}
exports.QuestionFormatCell = QuestionFormatCell;
