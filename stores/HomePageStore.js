import {BaseStore} from 'fluxible/addons';

class HomePageStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.featured = '';
        // this.slidesData = '';
        // this.userData = '';
    }
    updateContent(payload) {
        this.featured = payload.featured;
        // this.deckData = payload.deckData;
        // this.slidesData = payload.slidesData;
        // this.userData = payload.userData;
        this.emitChange();
    }
    getState() {
        return {
            featured: this.featured,
            // deckData: this.deckData,
            // slidesData: this.slidesData,
            // userData: this.userData,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.featured = state.featured;
        // this.deckData = state.deckData;
        // this.slidesData = state.slidesData;
        // this.userData = state.userData;
    }
}

HomePageStore.storeName = 'HomePageStore';
HomePageStore.handlers = {
    'LOAD_HOME_PAGE_SUCCESS': 'updateContent'
};

export default HomePageStore;
