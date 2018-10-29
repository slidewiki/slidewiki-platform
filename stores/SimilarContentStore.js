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
    updateSelector(payload){
        this.selector =  payload.selector;
        this.contents = []; //previuos contents are nor related with new selector, so we clean the variable
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
    'LOAD_SIMILAR_CONTENT_SUCCESS': 'updateSimilarContent',
    'SIMILAR_CONTENT_UPDATE_SELECTOR' : 'updateSelector'
};

export default SimilarContentStore;
