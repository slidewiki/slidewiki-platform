import {BaseStore} from 'fluxible/addons';

class DeckStore extends BaseStore {
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
            content: this.content
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.content = state.content;
    }
}

DeckStore.storeName = 'DeckStore';
DeckStore.handlers = {
    'LOAD_DECK_CONTENT_SUCCESS': 'updateContent'
};

export default DeckStore;
