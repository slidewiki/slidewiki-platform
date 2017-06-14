import {BaseStore} from 'fluxible/addons';

class ContentQuestionsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.questions = [];
        this.question = null;
        this.selector = {};
        this.totalLength = 0;
    }
    loadQuestions(payload) {
        this.questions = payload.questions;
        this.question = null;
        this.selector = payload.selector;
        this.totalLength = payload.totalLength;
        this.emitChange();
    }
    loadQuestion(payload) {
        this.question = this.questions.find((qst) => qst.id === payload.qstid);
        this.emitChange();
    }
    cancelQuestion(payload) {
        this.question = null;
        this.emitChange();
    }
    toggleAnswers(payload) {
        this.question = this.questions.find((qst) => qst.id === payload.qstid);
        let question = payload.question;
        if (question.answersShown) {
            question.answersShown = false;
        }
        else {
            question.answersShown = true;
        }
        this.emitChange();
    }
    getState() {
        return {
            questions: this.questions,
            question: this.question,
            selector: this.selector,
            totalLength: this.totalLength
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.questions = state.questions;
        this.question = state.question;
        this.selector = state.selector;
        this.totalLength = state.totalLength;
    }
}

ContentQuestionsStore.storeName = 'ContentQuestionsStore';
ContentQuestionsStore.handlers = {
    'LOAD_CONTENT_QUESTIONS_SUCCESS': 'loadQuestions',
    'LOAD_QUESTION': 'loadQuestion',
    'CANCEL_QUESTION': 'cancelQuestion',
    'TOGGLE_ANSWERS': 'toggleAnswers'
};

export default ContentQuestionsStore;
