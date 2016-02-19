import {BaseStore} from 'fluxible/addons';

class ContentHistoryStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.history = [];
    }
    updateHistory(payload) {
        this.history = payload.history;
        this.emitChange();
    }
    getState() {
        return {
            history: this.history
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.history = state.history;
    }
}

ContentHistoryStore.storeName = 'ContentHistoryStore';
ContentHistoryStore.handlers = {
    'LOAD_CONTENT_HISTORY_SUCCESS': 'updateHistory'
};

export default ContentHistoryStore;
