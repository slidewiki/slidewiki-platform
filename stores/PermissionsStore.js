import {BaseStore} from 'fluxible/addons';

class PermissionsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.permissions = {
            fork: false,
            edit: false,
            admin: false
        };
    }

    updatePermissions(payload) {
        this.permissions = payload.permissions;
        this.emitChange();
    }

    getState() {
        return {
            permissions: this.permissions
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.permissions = state.permissions;
    }
}

PermissionsStore.storeName = 'PermissionsStore';
PermissionsStore.handlers = {
    'UPDATE_PERMISSIONS': 'updatePermissions'
};

export default PermissionsStore;