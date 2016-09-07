import {BaseStore} from 'fluxible/addons';

class DeckViewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.content = '';
    }
    updateContent(payload) {
        this.content = payload.content;
        this.emitChange();
    }
    getState() {
        return {
            content: this.content,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.content = state.content;
    }
}

DeckViewStore.storeName = 'DeckViewStore';
DeckViewStore.handlers = {
    'LOAD_DECK_CONTENT_SUCCESS': 'updateContent'
};

export default DeckViewStore;
