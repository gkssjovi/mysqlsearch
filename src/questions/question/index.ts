import Choice from 'inquirer/lib/objects/choice';
import {Questions} from '..';
import {QuestionList} from '../question-list';
import {QuestionNode} from '../question-node';

export interface QuestionInterface {
    node(that: Questions, ql: QuestionList): QuestionNode;
    menu(): Partial<Choice>;
}

export class Question {
    params: Record<string, string> = {};
    message = '';
    actions: Record<string, string> = {};
    index: keyof QuestionList;

    constructor(index: keyof QuestionList, params = {}) {
        this.params = params;
        this.message = '';
        this.actions = {};
        this.index = index;
    }
}
