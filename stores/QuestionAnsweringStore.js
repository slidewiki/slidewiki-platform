import { BaseStore } from 'fluxible/addons';

class QuestionAnsweringStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.answers = [];
        this.question = '';
        this.isLoading = false;
        this.hasErrorOccurred = false;
    }
    getState() {
        return {
            answers: this.answers,
            isLoading: this.isLoading,
            question: this.question,
            hasErrorOccurred: this.hasErrorOccurred,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.answers = state.answers;
        this.isLoading = state.isLoading;
        this.question = state.question;
        this.hasErrorOccurred = state.hasErrorOccurred;
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
    setHasErrorOccurred(hasErrorOccurred) {
        this.hasErrorOccurred = hasErrorOccurred;
        this.emitChange();
    }
}

QuestionAnsweringStore.storeName = 'QuestionAnsweringStore';

QuestionAnsweringStore.handlers = {
    QUESTION_ANSWERING_SET_ANSWERS: 'setAnswers',
    QUESTION_ANSWERING_SET_IS_LOADING: 'setIsLoading',
    QUESTION_ANSWERING_SET_QUESTION: 'setQuestion',
    QUESTION_ANSWERING_SET_HAS_ERROR_OCCURRED: 'setHasErrorOccurred',
};

export default QuestionAnsweringStore;
