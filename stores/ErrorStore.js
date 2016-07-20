import {BaseStore} from 'fluxible/addons';

class ErrorStore extends BaseStore {
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

ErrorStore.storeName = 'ErrorStore';
ErrorStore.handlers = {
    'RESOURCE_NOT_FOUND_ERROR': 'handleError',
};

export default ErrorStore;
