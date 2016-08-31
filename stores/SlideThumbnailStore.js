import {BaseStore} from 'fluxible/addons';

class SlideThumbnailStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        //this.dispatcher = dispatcher; // Provides access to waitFor and getStore methods
        this.id = '';
        this.title = '';
        this.content = '';
    }
    updateContent(payload) {
        if (payload.slide.revisions !== undefined)
        {
            //this.id = payload.slide.id;
            this.title = payload.slide.revisions[payload.slide.revisions.length-1].title;
            this.content = payload.slide.revisions[payload.slide.revisions.length-1].content;
            this.emitChange();
        }
        else
        {
            this.title = 'title not found';
            this.content = 'content not found';
            this.emitChange();
        }
    }
    getState() {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.id = state.id;
        this.title = state.title;
        this.content = state.content;
    }
}

SlideThumbnailStore.storeName = 'SlideThumbnailStore';
SlideThumbnailStore.handlers = {
    'LOAD_SLIDE_THUMBNAIL_CONTENT': 'updateContent'
};

export default SlideThumbnailStore;
