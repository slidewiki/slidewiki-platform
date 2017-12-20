import {BaseStore} from 'fluxible/addons';

class SlideViewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        //this.dispatcher = dispatcher; // Provides access to waitFor and getStore methods
        this.id = '';
        this.slideId = '';
        this.title = '';
        this.content = '';
        this.speakernotes = '';
        this.tags = [];
        this.loadingIndicator = '';
    }
    loading(payload){
        this.loadingIndicator = payload.loadingIndicator;
        this.emitChange();
    }
    updateContent(payload) {
        if (payload.slide.revisions !== undefined)
        {
            //this.id = payload.slide.id;
            this.slideId = payload.selector.sid;
            let lastRevision = payload.slide.revisions[payload.slide.revisions.length-1];
            this.title = lastRevision.title;
            this.content = lastRevision.content;
            this.speakernotes = lastRevision.speakernotes;
            this.tags = lastRevision.tags? lastRevision.tags: [];
            this.loadingIndicator = 'false';
            this.emitChange();
        }
        else
        {
            this.slideId = '';
            this.title = 'title not found';
            this.content = 'content not found';
            this.tags = [];
            this.loadingIndicator = 'false';
            this.emitChange();
        }
    }
    getState() {
        return {
            id: this.id,
            slideId: this.slideId,
            title: this.title,
            content: this.content,
            tags: this.tags,
            speakernotes: this.speakernotes,
            loadingIndicator: this.loadingIndicator
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.id = state.id;
        this.slideId = state.slideId;
        this.title = state.title;
        this.content = state.content;
        this.tags = state.tags;
        this.speakernotes = state.speakernotes;
        this.loadingIndicator = state.loadingIndicator;
    }
}

SlideViewStore.storeName = 'SlideViewStore';
SlideViewStore.handlers = {
    'LOAD_SLIDE_CONTENT_SUCCESS': 'updateContent',
    'LOAD_SLIDE_CONTENT_LOAD': 'loading'
};

export default SlideViewStore;
