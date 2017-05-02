import {BaseStore} from 'fluxible/addons';

class ServiceErrorStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.error = '';
        this.previous = false;
    }
    getState() {
        return {
            error: this.error,
            previous: this.previous,
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
        this.previous = state.previous;
    }
    handleError(err) {
        if (!this.previous) {
            this.error = err;
            this.previous = true;
            this.emitChange();
        }
    }
}

ServiceErrorStore.storeName = 'ServiceErrorStore';
ServiceErrorStore.handlers = {
    'SERVICE_UNAVAILABLE': 'handleError',
};

export default ServiceErrorStore;
