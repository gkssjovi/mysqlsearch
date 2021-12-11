"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionTrimMatchContext = void 0;
const index_1 = require("./index");
const question_node_1 = require("../question-node");
const colors_1 = require("../../colors");
const state_1 = require("../../state");
class QuestionTrimMatchContext extends index_1.Question {
    constructor(index, params = {}) {
        super(index, params);
        this.message = 'trim-match-context';
    }
    render() {
        const state = (0, state_1.getState)();
        return this.message + (0, colors_1.colorize)(` (${state.trimMatchContext ? 'Yes' : 'No'})`, colors_1.Colors.Dim);
    }
    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }
    node(that, ql) {
        const { trimMatchContext } = (0, state_1.getState)();
        return new question_node_1.QuestionNode(this.index, {
            type: 'confirm',
            default: trimMatchContext ? 'Yes' : 'No',
            message: this.message,
        }, ({ value }, node) => {
            if (!node.parent) {
                return;
            }
            (0, state_1.setState)({ trimMatchContext: value ? true : false });
            that.setCurrent(node.parent.index);
            node.parent.updateChoiceMenu(this.index, this.render());
            node.updateDefault(value);
        });
    }
}
exports.QuestionTrimMatchContext = QuestionTrimMatchContext;
