"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionTable = void 0;
const index_1 = require("./index");
const mysql_1 = require("../../mysql");
const colors_1 = require("../../colors");
const state_1 = require("../../state");
const question_node_1 = require("../question-node");
const fuzzy_1 = __importDefault(require("fuzzy"));
class QuestionTable extends index_1.Question {
    constructor(index, params = {}) {
        super(index, params);
        this.message = 'table';
        this.actions = {
            none: ':none',
            back: ':back',
        };
    }
    render() {
        const state = (0, state_1.getState)();
        if (!state.table) {
            return this.message;
        }
        return this.message + (0, colors_1.colorize)(` (${state.table})`, colors_1.Colors.Dim);
    }
    menu() {
        return {
            name: this.render(),
            value: this.index,
        };
    }
    node(that, ql) {
        return new question_node_1.QuestionNode(this.index, {
            type: 'autocomplete',
            name: this.index,
            message: this.message,
            default: this.actions.back,
            emptyText: `No tables found. \n  ${this.actions.none} - to clear selection and go back \n  ${this.actions.back} - to go back`,
            source: async (answers, input) => {
                input = input || '';
                return fuzzy_1.default.filter(input, await this.getTables()).map((el) => el.original);
            },
        }, ({ value }, node) => {
            if (!node.parent) {
                return;
            }
            if (value === this.actions.none) {
                (0, state_1.setState)({ table: undefined });
                node.updateDefault(undefined);
                node.parent.updateChoiceMenu(this.index, this.render());
                that.setCurrent(node.parent.index);
            }
            else if (value === this.actions.back) {
                that.setCurrent(node.parent.index);
            }
            else {
                (0, state_1.setState)({ table: value });
                node.parent.updateChoiceMenu(this.index, this.render());
                that.setCurrent(node.parent.index);
                node.updateDefault(value);
            }
            node.parent.updateDefault(this.index);
        });
    }
    async getTables() {
        if (this.tables) {
            return this.tables;
        }
        const connection = await (0, mysql_1.createConnection)();
        const [results] = await connection.query(`SHOW TABLES`);
        const values = results.map((table) => Object.values(table)[0]);
        this.tables = [this.actions.back, this.actions.none, ...values];
        await connection.end();
        return this.tables;
    }
}
exports.QuestionTable = QuestionTable;
