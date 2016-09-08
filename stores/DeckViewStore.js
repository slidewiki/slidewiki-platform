import {BaseStore} from 'fluxible/addons';

class DeckViewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckMetaData = '';
        this.slidesData = '';
        this.userData = '';
    }
    updateContent(payload) {
        this.deckMetaData = payload.deckMetaData;
        this.slidesData = payload.slidesData;
        this.userData = payload.userData;
        this.emitChange();
    }
    getState() {
        return {
            deckMetaData: this.deckMetaData,
            slidesData: this.slidesData,
            userData: this.userData,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.deckMetaData = state.deckMetaData;
        this.slidesData = state.slidesData;
        this.userData = state.userData;
    }
}

DeckViewStore.storeName = 'DeckViewStore';
DeckViewStore.handlers = {
    'LOAD_DECK_CONTENT_SUCCESS': 'updateContent'
};

export default DeckViewStore;
