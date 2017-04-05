import {BaseStore} from 'fluxible/addons';

class PermissionsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.isNoPermissionsModalShown = false;
        this.deckId = null;
        this.permissions = {
            fork: false,
            edit: false,
            admin: false
        };
    }

    loadPermissions(payload) {
        this.permissions = payload.permissions;
        this.deckId = payload.deckId;
        this.emitChange();
    }

    resetPermissions(payload) {
        this.permissions = {
            fork: false,
            edit: false,
            admin: false
        };
        this.deckId = payload.deckId;
        this.emitChange();
    }

    showNoPermissionsModal(payload) {
        this.isNoPermissionsModalShown = true;
        this.emitChange();
    }

    hideNoPermissionsModal(payload) {
        this.isNoPermissionsModalShown = false;
        this.emitChange();
    }

    getState() {
        return {
            permissions: this.permissions,
            deckId: this.deckId,
            isNoPermissionsModalShown: this.isNoPermissionsModalShown
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.permissions = state.permissions;
        this.isNoPermissionsModalShown = state.isNoPermissionsModalShown;
        this.deckId = state.deckId;
    }
}

PermissionsStore.storeName = 'PermissionsStore';
PermissionsStore.handlers = {
    'LOAD_PERMISSIONS_SUCCESS': 'loadPermissions',
    'RESET_PERMISSIONS': 'resetPermissions',
    'SHOW_NO_PERMISSIONS_MODAL': 'showNoPermissionsModal',
    'HIDE_NO_PERMISSIONS_MODAL': 'hideNoPermissionsModal',

};

export default PermissionsStore;