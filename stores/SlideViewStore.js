import {BaseStore} from 'fluxible/addons';

class SlideViewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        //this.dispatcher = dispatcher; // Provides access to waitFor and getStore methods
        this.id = '';
        this.title = '';
        this.content = '';
        this.speakernotes = '';
    }
    updateContent(payload) {
        if (payload.slide.revisions !== undefined)
        {
            //this.id = payload.slide.id;
            this.title = payload.slide.revisions[payload.slide.revisions.length-1].title;
            this.content = payload.slide.revisions[payload.slide.revisions.length-1].content;
            this.speakernotes = payload.slide.revisions[payload.slide.revisions.length-1].speakernotes;
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
            speakernotes: this.speakernotes,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.id = state.id;
        this.title = state.title;
        this.content = state.content;
        this.speakernotes = state.speakernotes;
    }
}

SlideViewStore.storeName = 'SlideViewStore';
SlideViewStore.handlers = {
    'LOAD_SLIDE_CONTENT_SUCCESS': 'updateContent'
};

export default SlideViewStore;
