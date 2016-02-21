import {BaseStore} from 'fluxible/addons';

class ContentUsageStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.usage = [];
        this.selector = {};
    }
    updateUsage(payload) {
        this.usage = payload.usage;
        this.selector = payload.selector;
        this.emitChange();
    }
    getState() {
        return {
            usage: this.usage,
            selector: this.selector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.usage = state.usage;
        this.selector = state.selector;
    }
}

ContentUsageStore.storeName = 'ContentUsageStore';
ContentUsageStore.handlers = {
    'LOAD_CONTENT_USAGE_SUCCESS': 'updateUsage'
};

export default ContentUsageStore;
