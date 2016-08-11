import {BaseStore} from 'fluxible/addons';

class ContentHistoryStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.history = [];
        this.selector = {};
        this.error = '';
    }
    updateHistory(payload) {
        this.history = payload.history;
        this.selector = payload.selector;
        this.emitChange();
    }
    getState() {
        return {
            history: this.history,
            selector: this.selector,
            error: this.error,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.history = state.history;
        this.selector = state.selector;
        this.error = state.error;
    }
    handleDeckParamErrors(err) {
        this.error = err;
        this.emitChange();
    }
}

ContentHistoryStore.storeName = 'ContentHistoryStore';
ContentHistoryStore.handlers = {
    'DECK_ERROR': 'handleDeckParamErrors',
    'SLIDE_ERROR': 'handleDeckParamErrors',
    'LOAD_CONTENT_HISTORY_SUCCESS': 'updateHistory'
};

export default ContentHistoryStore;
