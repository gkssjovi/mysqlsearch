"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionSearch = void 0;
const index_1 = require("./index");
const state_1 = require("../../state");
const question_node_1 = require("../question-node");
class QuestionSearch extends index_1.Question {
    constructor(index, params = {}) {
        super(index, params);
        this.message = 'search:';
        this.actions = {
            setup: ':setup',
            q: ':q',
        };
    }
    render() {
        return this.message;
    }
    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }
    node(that, ql) {
        return new question_node_1.QuestionNode(this.index, {
            type: 'input',
            message: this.message,
        }, ({ value }) => {
            const setupNode = that.getNode('setup');
            if (setupNode) {
                setupNode.updateDefault(this.index);
            }
            if (value === this.actions.setup || value.trim().length == 0) {
                that.setCurrent(ql.setup.index);
                return false;
            }
            if (value === this.actions.q) {
                process.exit(0);
            }
            if (value.trim().length == 0) {
                return false;
            }
            (0, state_1.setState)({ search: value });
            return true;
        });
    }
}
exports.QuestionSearch = QuestionSearch;
