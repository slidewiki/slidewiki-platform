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
        this.changes = {};
        this.selector = payload.selector;
        this.emitChange();
    }

    getState() {
        return {
            revisions: this.revisions,
            changes: this.changes,
            selector: this.selector,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.revisions = state.revisions;
        this.changes = state.changes;
        this.selector = state.selector;
    }
}

DeckHistoryStore.storeName = 'DeckHistoryStore';
DeckHistoryStore.handlers = {
    'LOAD_DECK_REVISIONS_SUCCESS': 'loadDeckRevisions'
};

export default DeckHistoryStore;
