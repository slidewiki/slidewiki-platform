import {BaseStore} from 'fluxible/addons';

class ContentUsageStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.usage = [];
        this.selector = {};
        this.collections = [];
    }
    updateUsage(payload) {
        this.usage = payload.usage;
        this.selector = payload.selector;
        this.emitChange();
    }
    updateCollections(payload) {
        this.collections = payload;
        this.emitChange();
    }
    getState() {
        return {
            usage: this.usage,
            selector: this.selector,
            collections: this.collections,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.usage = state.usage;
        this.selector = state.selector;
        this.collections = state.collections;
    }
}

ContentUsageStore.storeName = 'ContentUsageStore';
ContentUsageStore.handlers = {
    'LOAD_CONTENT_USAGE_SUCCESS': 'updateUsage',
    'LOAD_DECK_COLLECTIONS_SUCCESS': 'updateCollections',
};

export default ContentUsageStore;
