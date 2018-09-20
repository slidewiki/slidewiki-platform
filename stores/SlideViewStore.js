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
    }
    updateContent(payload) {
        //this.id = payload.slide.id;
        this.slideId = payload.selector.sid;
        this.title = payload.slide.title;
        this.content = payload.slide.content;
        this.speakernotes = payload.slide.speakernotes;
        this.tags = payload.slide.tags || [];
        this.emitChange();
    }
    getState() {
        return {
            id: this.id,
            slideId: this.slideId,
            title: this.title,
            content: this.content,
            tags: this.tags,
            speakernotes: this.speakernotes,
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
    }
}

SlideViewStore.storeName = 'SlideViewStore';
SlideViewStore.handlers = {
    'LOAD_SLIDE_CONTENT_SUCCESS': 'updateContent'
};

export default SlideViewStore;
