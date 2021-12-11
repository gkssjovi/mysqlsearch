"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionSetup = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const index_1 = require("./index");
const question_node_1 = require("../question-node");
class QuestionSetup extends index_1.Question {
    constructor(index, params = {}) {
        super(index, params);
        this.message = 'setup';
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
            type: 'list',
            message: this.message,
            default: undefined,
            choices: [
                ql.search.menu(),
                new inquirer_1.default.Separator(),
                ql.formatRow.menu(),
                ql.formatCell.menu(),
                ql.trimMatchContext.menu(),
                ql.theme.menu(),
                ql.database.menu(),
                ql.table.menu(),
                ql.limit.menu(),
            ],
        }, ({ value }, node) => {
            if (value === ql.search.index) {
                that.setCurrent(ql.search.index);
            }
            if (value === ql.limit.index) {
                that.setCurrent(ql.limit.index);
            }
            if (value === ql.table.index) {
                that.setCurrent(ql.table.index);
            }
            if (value === ql.database.index) {
                that.setCurrent(ql.database.index);
            }
            if (value === ql.formatRow.index) {
                that.setCurrent(ql.formatRow.index);
            }
            if (value === ql.formatCell.index) {
                that.setCurrent(ql.formatCell.index);
            }
            if (value === ql.trimMatchContext.index) {
                that.setCurrent(ql.trimMatchContext.index);
            }
            if (value === ql.theme.index) {
                that.setCurrent(ql.theme.index);
            }
            return false;
        });
    }
}
exports.QuestionSetup = QuestionSetup;
