import {BaseStore} from 'fluxible/addons';

class RevisioningStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.status = {needs_revision: false, target_deck: 0, user: 0};
        this.result = {};
    }
    updateStatus(payload) {
        this.status = payload.status;
        this.emitChange();
    }
    updateResult(payload) {
        this.result = payload.result;
        this.emitChange();
    }
    getState() {
        return {
            status: this.status,
            result: this.result
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.status = state.status;
        this.result = state.result;
    }
}

RevisioningStore.storeName = 'RevisioningStore';
RevisioningStore.handlers = {
    'UPDATE_REVISIONING_STATUS': 'updateStatus',
    'UPDATE_REVISIONING_RESULT': 'updateResult'
};

export default RevisioningStore;
