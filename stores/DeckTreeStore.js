import {BaseStore} from 'fluxible/addons';

class DeckTreeStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.selector = {};
        this.deckTree = {};
    }
    updateDeckTree(payload) {
        this.deckTree = payload.deckTree;
        this.selector = payload.selector;
        this.emitChange();
    }
    selectTreeNode(args) {
        this.selector = {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        this.emitChange();
    }
    getState() {
        return {
            deckTree: this.deckTree,
            selector: this.selector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.deckTree = state.deckTree;
        this.selector = state.selector;
    }
}

DeckTreeStore.storeName = 'DeckTreeStore';
DeckTreeStore.handlers = {
    'LOAD_DECK_TREE_SUCCESS': 'updateDeckTree',
    'SELECT_TREE_NODE_SUCCESS': 'selectTreeNode'
};

export default DeckTreeStore;
