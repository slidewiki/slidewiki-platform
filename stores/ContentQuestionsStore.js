import {BaseStore} from 'fluxible/addons';

class ContentQuestionsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.questions = [];
        this.selector = {};
    }
    updateQuestions(payload) {
        this.questions = payload.questions;
        this.selector = payload.selector;
        this.emitChange();
    }
    getState() {
        return {
            questions: this.questions,
            selector: this.selector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.questions = state.questions;
        this.selector = state.selector;
    }
}

ContentQuestionsStore.storeName = 'ContentQuestionsStore';
ContentQuestionsStore.handlers = {
    'LOAD_CONTENT_QUESTIONS_SUCCESS': 'updateQuestions'
};

export default ContentQuestionsStore;
