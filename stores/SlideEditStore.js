import {BaseStore} from 'fluxible/addons';

class SlideEditStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        //this.dispatcher = dispatcher; // Provides access to waitFor and getStore methods
        this.id = '';
        this.title = '';
        this.content = '';
        this.speakernotes = '';
    }
    updateContent(payload) {
        //console.log('test' + payload + payload.slide.content + ' title: ' +  payload.slide.title + ' id: ' + payload.slide.id);
        //console.log('test' + payload.slide.revisions[0].title + ' id: ' + payload.slide.id);
        //console.log('test' + payload.slide.revisions);
        if (payload.slide.revisions !== undefined)
        {
            //this.id = payload.slide.id;
            this.title = payload.slide.revisions[payload.slide.revisions.length-1].title;
            this.content = payload.slide.revisions[payload.slide.revisions.length-1].content;
            //TODO speakernotes in database: now gives error:
            //body: '{"statusCode":400,"error":"Bad Request","message":"\\"speakernotes\\" is not allowed","validation":{"source":"payload","keys":["speakernotes"]}}' } }
            //this.speakernotes = payload.slide.revisions[0].speakernotes;
            this.speakernotes = 'speaker notes: More information on test.com';

            this.emitChange();
        }
        else
        {
            this.title = 'slide not found';
            this.content = 'slide not found';
            this.emitChange();
        }

    }
    saveSlide() {
        this.emitChange();
    }
    addSlide() {
        this.emitChange();
    }
    getState() {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            speakernotes: this.speakernotes
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

SlideEditStore.storeName = 'SlideEditStore';
SlideEditStore.handlers = {
    'LOAD_SLIDE_EDIT_SUCCESS': 'updateContent',
    'SAVE_SLIDE_EDIT_SUCCESS': 'saveSlide',
    'ADD_SLIDE_EDIT_SUCCESS': 'addSlide'
};

export default SlideEditStore;
