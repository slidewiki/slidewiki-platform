import {BaseStore} from 'fluxible/addons';

class DeckViewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckData = {};
        this.slidesData = {};
        this.userData = {};
        this.deckViewPanelHeight = 450;
    }
    updateContent(payload) {
        this.deckData = payload.deckData;
        this.slidesData = payload.slidesData;
        this.userData = payload.userData;
        this.deckViewPanelHeight = this.deckViewPanelHeight;
        this.emitChange();
    }
    updateDeckViewPanelHeight(expand) {
        if (expand) {
            this.deckViewPanelHeight = this.deckViewPanelHeight * 1.3;
        }
        else {
            this.deckViewPanelHeight = 450;
        }
        this.emitChange();
    }
    getState() {
        return {
            deckData: this.deckData,
            slidesData: this.slidesData,
            userData: this.userData,
            deckViewPanelHeight: this.deckViewPanelHeight,
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
    'LOAD_DECK_CONTENT_SUCCESS': 'updateContent',
    'UPDATE_DECK_VIEW_PANEL_HEIGHT': 'updateDeckViewPanelHeight',
};

export default DeckViewStore;
