import {BaseStore} from 'fluxible/addons';

class UserRegistrationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.registrationStatus = 'guest';
        this.errorMessage = '';
    }

    handleCreateUserSuccess(res) {
        if(res.error) {
            this.errorMessage = JSON.parse(res.error.error).message;
            this.registrationStatus = 'error';
        } else {
            this.registrationStatus = 'pending';
            this.errorMessage = '';
        }
        this.emitChange();
    }

    handleResetUserRegistrationStatus() {
        this.registrationStatus = 'guest';
        this.errorMessage = '';
        // this.emitChange();
    }

    handleUserRegistrationError(err) {
        this.errorMessage = err.message;
        this.registrationStatus = 'error';
        this.emitChange();
    }

    getState() {
        return {
            registrationStatus: this.registrationStatus,
            errorMessage: this.errorMessage
        };
    }

    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.registrationStatus = state.registrationStatus;
        this.errorMessage = state.errorMessage;
    }
}

UserRegistrationStore.storeName = 'UserRegistrationStore';
UserRegistrationStore.handlers = {
    'CREATE_USER_SUCCESS': 'handleCreateUserSuccess',
    'RESET_USER_REGISTRATION_STATUS': 'handleResetUserRegistrationStatus',
    //error handling msges
    'CREATE_USER_FAILURE': 'handleUserRegistrationError'
};

export default UserRegistrationStore;
