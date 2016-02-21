import {BaseStore} from 'fluxible/addons';

class ContentDiscussionStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.discussion = [];
    }
    updateDiscussion(payload) {
        this.discussion = payload.discussion;
        this.emitChange();
    }
    getState() {
        return {
            discussion: this.discussion
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.discussion = state.discussion;
    }
}

ContentDiscussionStore.storeName = 'ContentDiscussionStore';
ContentDiscussionStore.handlers = {
    'LOAD_CONTENT_DISCUSSION_SUCCESS': 'updateDiscussion'
};

export default ContentDiscussionStore;
