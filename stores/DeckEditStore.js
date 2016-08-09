import {BaseStore} from 'fluxible/addons';

class DeckEditStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckProps = {};
        this.error = '';
    }
    updateProperties(payload) {
        this.deckProps = payload.deckProps;
        this.emitChange();
    }
    getState() {
        return {
            deckProps: this.deckProps,
            error: this.error,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.deckProps = state.deckProps;
        this.error = state.error;
    }
    handleDeckParamErrors(err) {
        this.error = err;
        this.emitChange();
    }
}

DeckEditStore.storeName = 'DeckEditStore';
DeckEditStore.handlers = {
    'DECK_ERROR': 'handleDeckParamErrors',
    'LOAD_DECK_PROPS_SUCCESS': 'updateProperties'
};

export default DeckEditStore;
