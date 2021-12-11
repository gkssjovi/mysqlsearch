"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionDatabase = void 0;
const index_1 = require("./index");
const mysql_1 = require("../../mysql");
const colors_1 = require("../../colors");
const state_1 = require("../../state");
const question_node_1 = require("../question-node");
const fuzzy_1 = __importDefault(require("fuzzy"));
class QuestionDatabase extends index_1.Question {
    constructor(index, params = {}) {
        super(index, params);
        this.databases = null;
        this.message = 'database';
        this.actions = {
            back: ':back',
        };
    }
    render() {
        const state = (0, state_1.getState)();
        if (!state.database) {
            return this.message;
        }
        return this.message + (0, colors_1.colorize)(` (${state.database})`, colors_1.Colors.Dim);
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
            emptyText: `No databases found. \n  ${this.actions.back} -  to go back`,
            source: async (answers, input) => {
                input = input || '';
                return fuzzy_1.default.filter(input, await this.getDatabases()).map((el) => el.original);
            },
        }, ({ value }, node) => {
            if (!node.parent) {
                return;
            }
            if (value === this.actions.back) {
                that.setCurrent(node.parent.index);
            }
            else {
                const state = (0, state_1.getState)();
                (0, state_1.setState)({ database: value });
                node.parent.updateChoiceMenu(this.index, this.render());
                that.setCurrent(node.parent.index);
                node.updateDefault(value);
                if (state.database !== value) {
                    (0, state_1.setState)({ table: undefined });
                    const tableNode = that.getNode(ql.table.index);
                    if (tableNode) {
                        tableNode.updateDefault(undefined);
                        node.parent.updateChoiceMenu(ql.table.index, ql.table.render());
                    }
                }
            }
        });
    }
    async getDatabases() {
        if (this.databases) {
            return this.databases;
        }
        const connection = await (0, mysql_1.createConnection)();
        const [results] = await connection.query(`SHOW DATABASES`);
        const values = results.map((database) => Object.values(database)[0]);
        this.databases = [this.actions.back, ...values];
        await connection.end();
        return this.databases;
    }
}
exports.QuestionDatabase = QuestionDatabase;
