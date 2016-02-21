import {BaseStore} from 'fluxible/addons';

class ContentDiscussionStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.discussion = [];
        this.selector = {};
    }
    updateDiscussion(payload) {
        this.discussion = payload.discussion;
        this.selector = payload.selector;
        this.emitChange();
    }
    getState() {
        return {
            discussion: this.discussion,
            selector: this.selector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.discussion = state.discussion;
        this.selector = state.selector;
    }
}

ContentDiscussionStore.storeName = 'ContentDiscussionStore';
ContentDiscussionStore.handlers = {
    'LOAD_CONTENT_DISCUSSION_SUCCESS': 'updateDiscussion'
};

export default ContentDiscussionStore;
