import {BaseStore} from 'fluxible/addons';

class SimilarContentStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.contents = [];
        this.selector = {};
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
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.contents = state.contents;
        this.selector = state.selector;
    }
}

SimilarContentStore.storeName = 'SimilarContentStore';
SimilarContentStore.handlers = {
    'LOAD_SIMILAR_CONTENT_SUCCESS': 'updateSimilarContent'
};

export default SimilarContentStore;
