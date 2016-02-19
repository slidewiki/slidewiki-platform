import {BaseStore} from 'fluxible/addons';

class SlideViewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        //this.dispatcher = dispatcher; // Provides access to waitFor and getStore methods
        this.content = '';
    }
    updateContent(payload) {
        this.content = payload.content;
        this.emitChange();
    }
    getState() {
        return {
            content: this.content
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.content = state.content;
    }
}

SlideViewStore.storeName = 'SlideViewStore';
SlideViewStore.handlers = {
    'LOAD_SLIDE_CONTENT_SUCCESS': 'updateContent'
};

export default SlideViewStore;
