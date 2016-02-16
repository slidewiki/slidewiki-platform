import {BaseStore} from 'fluxible/addons';

class DeckTreeStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckTree = [];
    }
    updateDeckTree(payload) {
        this.deckTree = payload.deckTree;
        this.emitChange();
    }
    getState() {
        return {
            activities: this.deckTree
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.deckTree = state.deckTree;
    }
}

DeckTreeStore.storeName = 'DeckTreeStore';
DeckTreeStore.handlers = {
    'LOAD_DECK_TREE_SUCCESS': 'updateDeckTree'
};

export default DeckTreeStore;
