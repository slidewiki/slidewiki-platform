import {BaseStore} from 'fluxible/addons';

class UserRegistrationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.userType = 'guest';
    }

    handleCreateUserSuccess() {
        this.userType = 'pending';
        this.emitChange();
    }

    handleResetUserRegistration() {
        this.userType = 'guest';
        this.emitChange();
    }

    getState() {
        return {
            userType: this.userType
        };
    }

    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.userType = state.userType;
    }
}

UserRegistrationStore.storeName = 'UserRegistrationStore';
UserRegistrationStore.handlers = {
    'CREATE_USER_SUCCESS': 'handleCreateUserSuccess',
    'RESET_USER_REGISTRATION': 'handleResetUserRegistration'
};

export default UserRegistrationStore;
