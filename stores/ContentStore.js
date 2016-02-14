import {BaseStore} from 'fluxible/addons';

class ContentStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.contentType = '';
        this.contentID = 0;
        this.mode = 'view';
    }
    updateContent(payload) {
        this.contentType = payload.params.stype;
        this.contentID = payload.params.sid;
        this.mode = payload.params.mode;
        this.emitChange();
    }
    getState() {
        return {
            contentType: this.contentType,
            contentID: this.contentID,
            mode: this.mode
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.contentType = state.contentType;
        this.contentID = state.contentID;
        this.mode = state.mode;
    }
}

ContentStore.storeName = 'ContentStore';
ContentStore.handlers = {
    'UPDATE_CONTENT': 'updateContent'
};

export default ContentStore;
