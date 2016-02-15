import {BaseStore} from 'fluxible/addons';

class ContentStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.contextID = 0;
        this.contextPosition = 0;
        this.contentType = '';
        this.contentID = 0;
        this.mode = 'view';
    }
    updateContent(payload) {
        this.contextID = payload.params.id;
        this.contextPosition = payload.params.sposition;
        this.contentType = payload.params.stype;
        this.contentID = payload.params.sid;
        this.mode = payload.params.mode;
        this.emitChange();
    }
    getState() {
        return {
            contextID: this.contextID,
            contextPosition: this.contextPosition,
            contentType: this.contentType,
            contentID: this.contentID,
            mode: this.mode
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.contextID = state.contextID;
        this.contextPosition = state.contextPosition;
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
