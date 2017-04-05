import {BaseStore} from 'fluxible/addons';

class ServiceErrorStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.error = {};
    }
    getState() {
        return {
            error: this.error,
        };
    }
    updateContent(payload) {
        this.emitChange();
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.error = state.error;
    }
    handleError(err) {
        this.error = err;
        this.emitChange();
    }
}

ServiceErrorStore.storeName = 'ServiceErrorStore';
ServiceErrorStore.handlers = {
    'SERVICE_UNAVAILABLE': 'handleError',
};

export default ServiceErrorStore;
