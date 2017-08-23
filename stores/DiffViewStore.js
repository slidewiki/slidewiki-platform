import {BaseStore} from 'fluxible/addons';

class DiffViewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.baseSlide = {};
        this.diffSlide = {};
    }
    updateDiffview(payload) {
        this.baseSlide = payload.baseSlide;
        this.diffSlide = payload.diffSlide;
        this.emitChange();
    }
    getState() {
        return {
            baseSlide: this.baseSlide,
            diffSlide: this.diffSlide
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.baseSlide = state.baseSlide;
        this.diffSlide = state.diffSlide;
    }
    handleDeckParamErrors(err) {
        this.emitChange();
    }
}

DiffViewStore.storeName = 'DiffViewStore';
DiffViewStore.handlers = {
    'LOAD_CONTENT_DIFFVIEW_SUCCESS': 'updateDiffview'
};

export default DiffViewStore;
