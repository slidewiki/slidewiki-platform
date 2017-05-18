import {BaseStore} from 'fluxible/addons';

class DeckHistoryStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.revisions = [];
        this.changes = {};
        this.selector = {};
    }
    loadDeckRevisions(payload) {
        this.revisions = payload.revisions;
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
}

DeckHistoryStore.storeName = 'ContentHistoryStore';
DeckHistoryStore.handlers = {
    'LOAD_DECK_REVISIONS_SUCCESS': 'loadDeckRevisions'
};

export default DeckHistoryStore;
