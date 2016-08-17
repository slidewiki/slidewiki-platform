import {BaseStore} from 'fluxible/addons';

class ErrorStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.error = '';
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
    'DECK_ID_TYPE_ERROR'        : 'handleError',
    'DECK_CONTENT_TYPE_ERROR'   : 'handleError',
    'DECK_CONTENT_PATH_ERROR'   : 'handleError',
    'DECK_MODE_ERROR'           : 'handleError',
    'GATEWAY_TIMEOUT_ERROR'     : 'handleError',
    'LOGIN_INCORRECT_ERROR'     : 'handleError',
    'METHOD_NOT_ALLOWED_ERROR'  : 'handleError',
    'NOT_FOUND_ERROR'           : 'handleError',
    'SLIDE_ID_TYPE_ERROR'       : 'handleError',
    'SEARCH_QUERY_EMPTY_ERROR'  : 'handleError',
    'SEARCH_SYNTAX_ERROR'       : 'handleError',
    'SERVICE_UNAVAILABLE'       : 'handleError',
    'TOO_MANY_REQUESTS_ERROR'   : 'handleError',
};

export default ErrorStore;
