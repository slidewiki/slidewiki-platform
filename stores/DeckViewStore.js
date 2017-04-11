import {BaseStore} from 'fluxible/addons';

class DeckViewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckData = {};
        this.slidesData = {};
        this.creatorData = {};
        this.ownerData = {};
        this.originCreatorData = {};
	    this.deckViewPanelHeight = 450;

    }
    updateContent(payload) {
        this.deckData = payload.deckData;
        this.slidesData = payload.slidesData;
        this.creatorData = payload.creatorData;
        this.ownerData = payload.ownerData;
        this.originCreatorData = payload.originCreatorData;
	    this.deckViewPanelHeight = this.deckViewPanelHeight;
        this.emitChange();
    }
    updateDeckViewPanelHeight(expand) {
        this.deckViewPanelHeight = expand === 1 ? this.deckViewPanelHeight * 1.3 : 450;
        this.emitChange();
    }

    getState() {
        return {
            deckData: this.deckData,
            slidesData: this.slidesData,
            creatorData: this.creatorData,
            ownerData: this.ownerData,
            originCreatorData: this.originCreatorData,
	        deckViewPanelHeight: this.deckViewPanelHeight
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
        this.originCreatorData = state.originCreatorData;
	    this.deckViewPanelHeight = state.deckViewPanelHeight;
    }
}

DeckViewStore.storeName = 'DeckViewStore';
DeckViewStore.handlers = {
    'LOAD_DECK_CONTENT_SUCCESS': 'updateContent',
    'UPDATE_DECK_VIEW_PANEL_HEIGHT': 'updateDeckViewPanelHeight',
};

export default DeckViewStore;
