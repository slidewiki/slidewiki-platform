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
    updateSlideThumbnail(payload){

        for(let i=0;i<this.contents.length;i++){
            if(this.contents[i].id === payload.selector.sid){

                this.contents[i].imgSrc = payload.contents.src;
            }
        }
        this.emitChange();
    }
    getState() {
        return {
            contents: this.contents,
            selector: this.selector
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
    'GET_SLIDE_THUMBNAIL_SUCCESS': 'updateSlideThumbnail'
};

export default SimilarContentStore;
