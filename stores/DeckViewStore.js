import {BaseStore} from 'fluxible/addons';

class DeckViewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckData = {};
        this.slidesData = {};
        this.creatorData = {};
        this.ownerData = {};

    }
    updateContent(payload) {
        this.deckData = payload.deckData;
        this.slidesData = payload.slidesData;
        this.creatorData = payload.creatorData;
        this.ownerData = payload.ownerData;
        this.emitChange();
    }
    getState() {
        return {
            deckData: this.deckData,
            slidesData: this.slidesData,
            creatorData: this.creatorData,
            ownerData: this.ownerData
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.deckData = state.deckData;
        this.slidesData = state.slidesData;
        this.creatorData = state.creatorData;
        this.ownerData = state.ownerData;
    }
}

DeckViewStore.storeName = 'DeckViewStore';
DeckViewStore.handlers = {
    'LOAD_DECK_CONTENT_SUCCESS': 'updateContent'
};

export default DeckViewStore;
