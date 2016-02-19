import {BaseStore} from 'fluxible/addons';

class ContentUsageStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.usage = [];
    }
    updateUsage(payload) {
        this.usage = payload.usage;
        this.emitChange();
    }
    getState() {
        return {
            usage: this.usage
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.usage = state.usage;
    }
}

ContentUsageStore.storeName = 'ContentUsageStore';
ContentUsageStore.handlers = {
    'LOAD_CONTENT_USAGE_SUCCESS': 'updateUsage'
};

export default ContentUsageStore;
