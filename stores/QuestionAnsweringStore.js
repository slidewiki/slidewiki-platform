import { BaseStore } from 'fluxible/addons';

class QuestionAnsweringStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.answers = [];
        this.question = '';
        this.isLoading = false;
    }
    getState() {
        return {
            answers: this.answers,
            isLoading: this.isLoading,
            question: this.question,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.answers = state.answers;
        this.isLoading = state.isLoading;
        this.question = state.question;
    }
    setAnswers(answers) {
        this.answers = answers;
        this.emitChange();
    }
    setIsLoading(isLoading) {
        this.isLoading = isLoading;
        this.emitChange();
    }
    setQuestion(question) {
        this.question = question;
        this.emitChange();
    }
}

QuestionAnsweringStore.storeName = 'QuestionAnsweringStore';

QuestionAnsweringStore.handlers = {
    QUESTION_ANSWERING_SET_ANSWERS: 'setAnswers',
    QUESTION_ANSWERING_SET_IS_LOADING: 'setIsLoading',
    QUESTION_ANSWERING_SET_QUESTION: 'setQuestion',
};

export default QuestionAnsweringStore;
