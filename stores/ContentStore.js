import {BaseStore} from 'fluxible/addons';

class ContentStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.selector = {'id': 0, 'spath': '', 'sid': 0, 'stype': '', page: 'content'};
        this.mode = 'view';
        this.error = '';
    }
    updateContent(payload) {
        this.selector= {'id': payload.params.id, 'spath': payload.params.spath, 'sid': payload.params.sid, 'stype': payload.params.stype, 'page': payload.page};
        this.mode = payload.params.mode;
        this.emitChange();
    }
    updateSelector(selector) {
        this.selector.id = selector.id;
        this.selector.spath = selector.spath;
        this.selector.sid = selector.sid;
        this.selector.stype = selector.stype;
        this.emitChange();
    }
    getState() {
        return {
            selector: this.selector,
            mode: this.mode,
            error: this.error,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.selector = state.selector;
        this.mode = state.mode;
        this.error = state.error;
    }
    handleDeckParamErrors(err) {
        this.error = err;
        this.emitChange();
    }
}

ContentStore.storeName = 'ContentStore';
ContentStore.handlers = {
    'DECK_ERROR': 'handleDeckParamErrors',
    'SLIDE_ERROR': 'handleDeckParamErrors',
    'UPDATE_CONTENT': 'updateContent',
    'UPDATE_CONTENT_SELECTOR': 'updateSelector'
};

export default ContentStore;
