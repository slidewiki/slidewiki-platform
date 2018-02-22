import {BaseStore} from 'fluxible/addons';

class EditRightsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.errorCode = 0;
        this.state = '';
    }

    getState() {
        return {
            errorCode: this.errorCode,
            state: this.state
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.errorCode = state.errorCode;
        this.state = state.state;
    }

    error(error) {
        this.errorCode = error.statusCode;
        this.state = 'error';
        this.emitChange();
    }

    success() {
        this.errorCode = 0;
        this.state = 'success';
        this.emitChange();
    }

    alreadyRequested() {
        this.errorCode = 0;
        this.state = 'alreadyRequested';
        this.emitChange();
        this.state = '';
    }
}

EditRightsStore.storeName = 'EditRightsStore';
EditRightsStore.handlers = {
    'EDITRIGHTS_ERROR': 'error',
    'EDITRIGHTS_SUCCESS': 'success',
    'EDITRIGHTS_SUCCESS_ALREADY_REQUESTED': 'alreadyRequested'
};

export default EditRightsStore;
