import {BaseStore} from 'fluxible/addons';

class SimilarContentStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.contents = [];
        this.selector = {};
        this.error = '';
    }
    updateSimilarContent(payload) {
        this.contents = payload.contents;
        this.selector = payload.selector;
        this.emitChange();
    }
    getState() {
        return {
            contents: this.contents,
            selector: this.selector,
            error: this.error,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.contents = state.contents;
        this.selector = state.selector;
        this.error = state.error;
    }
    handleDeckParamErrors(err) {
        this.error = err;
        this.emitChange();
    }
}

SimilarContentStore.storeName = 'SimilarContentStore';
SimilarContentStore.handlers = {
    'LOAD_SIMILAR_CONTENT_SUCCESS': 'updateSimilarContent',
    'DECK_ERROR': 'handleDeckParamErrors',
    'SLIDE_ERROR': 'handleDeckParamErrors',
};

export default SimilarContentStore;
