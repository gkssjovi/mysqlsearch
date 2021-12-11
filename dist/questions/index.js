"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Questions = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const question_list_1 = require("./question-list");
const inquirer_autocomplete_prompt_1 = __importDefault(require("inquirer-autocomplete-prompt"));
inquirer_1.default.registerPrompt('autocomplete', inquirer_autocomplete_prompt_1.default);
class Questions {
    constructor(current) {
        this.root = question_list_1.QuestionList.search.node(this, question_list_1.QuestionList);
        this.current = this.root;
        const setup = this.root.addChild(question_list_1.QuestionList.setup.node(this, question_list_1.QuestionList));
        setup.addChilds([
            question_list_1.QuestionList.limit.node(this, question_list_1.QuestionList),
            question_list_1.QuestionList.table.node(this, question_list_1.QuestionList),
            question_list_1.QuestionList.database.node(this, question_list_1.QuestionList),
            question_list_1.QuestionList.formatRow.node(this, question_list_1.QuestionList),
            question_list_1.QuestionList.formatCell.node(this, question_list_1.QuestionList),
            question_list_1.QuestionList.trimMatchContext.node(this, question_list_1.QuestionList),
            question_list_1.QuestionList.theme.node(this, question_list_1.QuestionList),
        ]);
        if (current) {
            this.setCurrent(current);
        }
    }
    async prompt(value) {
        return await inquirer_1.default.prompt([value]);
    }
    setCurrent(index) {
        const node = this.getNode(index);
        if (!node) {
            throw new Error(`Invalid node "${index}"`);
        }
        this.current = node;
    }
    getCurrent() {
        return this.current;
    }
    getNode(index, _current) {
        if (!_current) {
            _current = this.root;
        }
        if (_current.index === index) {
            return _current;
        }
        if (_current.childrens.length > 0) {
            for (let i = 0; i < _current.childrens.length; i++) {
                const child = _current === null || _current === void 0 ? void 0 : _current.childrens[i];
                const node = this.getNode(index, child);
                if (node) {
                    return node;
                }
            }
        }
        return null;
    }
    getRoot() {
        return this.root;
    }
}
exports.Questions = Questions;
