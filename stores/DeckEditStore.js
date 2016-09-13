import {BaseStore} from 'fluxible/addons';

class DeckEditStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckProps = {};
        this.selector = {};

    }
    updateProperties(payload) {
        this.deckProps = payload.deckProps;
        this.selector = payload.selector;
        this.emitChange();
    }
    getState() {
        return {
            deckProps: this.deckProps,
            selector: this.selector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.deckProps = state.deckProps;
        this.selector = state.selector;
    }
}

DeckEditStore.storeName = 'DeckEditStore';
DeckEditStore.handlers = {
    'LOAD_DECK_PROPS_SUCCESS': 'updateProperties'
};

export default DeckEditStore;
