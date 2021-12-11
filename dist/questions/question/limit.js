"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionLimit = void 0;
const index_1 = require("./index");
const colors_1 = require("../../colors");
const state_1 = require("../../state");
const question_node_1 = require("../question-node");
class QuestionLimit extends index_1.Question {
    constructor(index, params = {}) {
        super(index, params);
        this.message = 'limit';
    }
    render() {
        const state = (0, state_1.getState)();
        if (!state.limit) {
            return this.message;
        }
        return this.message + (0, colors_1.colorize)(` (${state.limit})`, colors_1.Colors.Dim);
    }
    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }
    node(that, ql) {
        const { limit } = (0, state_1.getState)();
        return new question_node_1.QuestionNode(this.index, {
            type: 'input',
            message: this.message + ':',
            default: limit,
            validate: function (value) {
                return isNaN(Number(value)) ? 'The value must be an integer' : true;
            },
        }, ({ value }, node) => {
            if (!node.parent) {
                return;
            }
            (0, state_1.setState)({ limit: Number(value) });
            node.setValue({ default: Number(value) });
            node.parent.updateChoiceMenu(this.index, this.render());
            that.setCurrent(node.parent.index);
        });
    }
}
exports.QuestionLimit = QuestionLimit;
