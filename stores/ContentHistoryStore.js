import {BaseStore} from 'fluxible/addons';

class ContentHistoryStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.history = [];
        this.selector = {};
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
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.history = state.history;
        this.selector = state.selector;
    }
    handleDeckParamErrors(err) {
        this.emitChange();
    }
}

ContentHistoryStore.storeName = 'ContentHistoryStore';
ContentHistoryStore.handlers = {
    'LOAD_CONTENT_HISTORY_SUCCESS': 'updateHistory'
};

export default ContentHistoryStore;
