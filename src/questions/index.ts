import inquirer, {QuestionCollection} from 'inquirer';
import {QuestionList} from './question-list';
import {PartialQuestion, QuestionNode} from './question-node';
import inquirerAutocompletePrompt from 'inquirer-autocomplete-prompt';

inquirer.registerPrompt('autocomplete', inquirerAutocompletePrompt);

export class Questions {
    root: QuestionNode;
    current: QuestionNode;

    constructor(current?: keyof QuestionList) {
        this.root = QuestionList.search.node(this, QuestionList);

        this.current = this.root;

        const setup = this.root.addChild(QuestionList.setup.node(this, QuestionList));
        setup.addChilds([
            QuestionList.limit.node(this, QuestionList),
            QuestionList.table.node(this, QuestionList),
            QuestionList.database.node(this, QuestionList),
            QuestionList.formatRow.node(this, QuestionList),
            QuestionList.formatCell.node(this, QuestionList),
            QuestionList.trimMatchContext.node(this, QuestionList),
            QuestionList.theme.node(this, QuestionList),
        ]);

        if (current) {
            this.setCurrent(current);
        }
    }

    async prompt(value: PartialQuestion) {
        return await inquirer.prompt([value]);
    }

    setCurrent(index: keyof QuestionList) {
        const node = this.getNode(index);
        if (!node) {
            throw new Error(`Invalid node "${index}"`);
        }

        this.current = node;
    }

    getCurrent(): QuestionNode {
        return this.current;
    }

    getNode(index: keyof QuestionList, _current?: QuestionNode): QuestionNode | null {
        if (!_current) {
            _current = this.root;
        }

        if (_current.index === index) {
            return _current;
        }

        if (_current.childrens.length > 0) {
            for (let i = 0; i < _current.childrens.length; i++) {
                const child = _current?.childrens[i];
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
