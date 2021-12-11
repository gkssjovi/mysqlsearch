"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
class Question {
    constructor(index, params = {}) {
        this.params = {};
        this.message = '';
        this.actions = {};
        this.params = params;
        this.message = '';
        this.actions = {};
        this.index = index;
    }
}
exports.Question = Question;
