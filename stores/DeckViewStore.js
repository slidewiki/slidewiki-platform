import {BaseStore} from 'fluxible/addons';

class DeckViewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckData = {};
        this.slidesData = {};
        this.userData = {};
    }
    updateContent(payload) {
        this.deckData = payload.deckData;
        this.slidesData = payload.slidesData;
        this.userData = payload.userData;
        this.emitChange();
    }
    getState() {
        return {
            deckData: this.deckData,
            slidesData: this.slidesData,
            userData: this.userData,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.deckData = state.deckData;
        this.slidesData = state.slidesData;
        this.userData = state.userData;
    }
}

DeckViewStore.storeName = 'DeckViewStore';
DeckViewStore.handlers = {
    'LOAD_DECK_CONTENT_SUCCESS': 'updateContent'
};

export default DeckViewStore;
