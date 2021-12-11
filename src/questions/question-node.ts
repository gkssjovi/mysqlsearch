import {Answers, DistinctQuestion, Question} from 'inquirer';
import Choice from 'inquirer/lib/objects/choice';
import Separator from 'inquirer/lib/objects/separator';
import {QuestionList} from './question-list';

type ResponseAnswers = {value: string};

type QuestionResponse = (response: ResponseAnswers, node: QuestionNode) => boolean | void;
type PartialChoice = Partial<Choice | string | Separator>;

type PartialQuestionValue = {
    choices: PartialChoice[];
    type: DistinctQuestion['type'] | 'autocomplete';
    emptyText: string;
    source: (answers: Answers, input: string) => any;
    pageSize: number;
};

export type PartialQuestion = Partial<Question & PartialQuestionValue>;

export class QuestionNode {
    index: keyof QuestionList;
    value: PartialQuestion;
    parent: QuestionNode | null;
    childrens: QuestionNode[];
    response: QuestionResponse;

    constructor(index: keyof QuestionList, value: PartialQuestion, response: QuestionResponse) {
        this.index = index;
        this.value = {
            ...value,
            name: 'value',
            pageSize: 10,
            prefix: '',
        };
        this.parent = null;
        this.childrens = [];
        this.response = response;
    }

    setValue(newValue: PartialQuestion) {
        this.value = {
            ...this.value,
            ...newValue,
        };
    }

    getValue() {
        return this.value;
    }

    addChild(childNode: QuestionNode) {
        childNode.parent = this;
        this.childrens.push(childNode);
        return childNode;
    }

    addChilds(childrens: QuestionNode[]) {
        for (let index = 0; index < childrens.length; index++) {
            const child = childrens[index];
            this.addChild(child);
        }
    }

    sendResponse(response: Answers) {
        if (typeof this.response === 'function') {
            if (this.parent && this.parent.index !== 'search') {
                this.parent.updateDefault(this.index);
            }

            return !this.response(response as ResponseAnswers, this);
        }

        return true;
    }

    updateDefault(value: string | undefined) {
        this.value = {
            ...this.value,
            default: value,
        };
    }

    updateChoiceMenu(idx: string, choiceName: string) {
        const choices = [...(typeof this.value.choices !== 'undefined' ? this.value.choices : [])];
        const index = choices.findIndex((choice) => {
            if (typeof choice !== 'object') {
                return false;
            }

            if (!Object.prototype.hasOwnProperty.call(choice, 'value')) {
                return false;
            }

            return (choice as Choice).value === idx;
        });

        choices[index] = {
            ...(choices[index] as Choice),
            name: choiceName,
        } as PartialChoice;

        this.setValue({choices});
    }
}
