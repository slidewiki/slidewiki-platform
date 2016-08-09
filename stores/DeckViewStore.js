import {BaseStore} from 'fluxible/addons';

class DeckViewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.content = '';
        this.error = '';
    }
    updateContent(payload) {
        this.content = payload.content;
        this.emitChange();
    }
    getState() {
        return {
            content: this.content,
            error: this.error,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.content = state.content;
        this.error = state.error;
    }
    handleDeckParamErrors(err) {
        this.error = err;
        this.emitChange();
    }
}

DeckViewStore.storeName = 'DeckViewStore';
DeckViewStore.handlers = {
    'DECK_ERROR': 'handleDeckParamErrors',
    'LOAD_DECK_CONTENT_SUCCESS': 'updateContent'
};

export default DeckViewStore;
