import {BaseStore} from 'fluxible/addons';

class DeckEditStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckProps = {};
    }
    updateProperties(payload) {
        this.deckProps = payload.deckProps;
        this.emitChange();
    }
    getState() {
        return {
            deckProps: this.deckProps,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.deckProps = state.deckProps;
    }
}

DeckEditStore.storeName = 'DeckEditStore';
DeckEditStore.handlers = {
    'LOAD_DECK_PROPS_SUCCESS': 'updateProperties'
};

export default DeckEditStore;
