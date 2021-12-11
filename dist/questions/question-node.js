"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionNode = void 0;
class QuestionNode {
    constructor(index, value, response) {
        this.index = index;
        this.value = Object.assign(Object.assign({}, value), { name: 'value', pageSize: 10, prefix: '' });
        this.parent = null;
        this.childrens = [];
        this.response = response;
    }
    setValue(newValue) {
        this.value = Object.assign(Object.assign({}, this.value), newValue);
    }
    getValue() {
        return this.value;
    }
    addChild(childNode) {
        childNode.parent = this;
        this.childrens.push(childNode);
        return childNode;
    }
    addChilds(childrens) {
        for (let index = 0; index < childrens.length; index++) {
            const child = childrens[index];
            this.addChild(child);
        }
    }
    sendResponse(response) {
        if (typeof this.response === 'function') {
            if (this.parent && this.parent.index !== 'search') {
                this.parent.updateDefault(this.index);
            }
            return !this.response(response, this);
        }
        return true;
    }
    updateDefault(value) {
        this.value = Object.assign(Object.assign({}, this.value), { default: value });
    }
    updateChoiceMenu(idx, choiceName) {
        const choices = [...(typeof this.value.choices !== 'undefined' ? this.value.choices : [])];
        const index = choices.findIndex((choice) => {
            if (typeof choice !== 'object') {
                return false;
            }
            if (!Object.prototype.hasOwnProperty.call(choice, 'value')) {
                return false;
            }
            return choice.value === idx;
        });
        choices[index] = Object.assign(Object.assign({}, choices[index]), { name: choiceName });
        this.setValue({ choices });
    }
}
exports.QuestionNode = QuestionNode;
