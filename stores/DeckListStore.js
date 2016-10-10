import {BaseStore} from 'fluxible/addons';

class DeckListStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.featured = '';
        this.recent = '';
    }
    updateFeatured(payload) {
        this.featured = payload.featured;

        this.emitChange();
    }
    updateRecent(payload) {
        this.recent = payload.recent;
        this.emitChange();
    }
    getState() {
        return {
            featured: this.featured,
            recent: this.recent,

        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.featured = state.featured;
        this.recent = state.recent;

    }
}

DeckListStore.storeName = 'DeckListStore';
DeckListStore.handlers = {
    'LOAD_FEATURED_SUCCESS': 'updateFeatured',
    'LOAD_RECENT_SUCCESS': 'updateRecent'
};

export default DeckListStore;
