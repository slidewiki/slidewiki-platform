import {BaseStore} from 'fluxible/addons';

class UserRegistrationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.registrationStatus = 'guest';
        this.errorMessage = '';
    }

    handleCreateUserSuccess(res) {
        // if(res.error) {
        //     this.errorMessage = JSON.parse(res.error.error).message;
        //     if (this.errorMessage === undefined) {
        //         this.errorMessage = JSON.parse(res.error.error).error;
        //     }
        //     this.registrationStatus = 'error';
        // } else {
        this.registrationStatus = 'pending';
        this.errorMessage = '';
        // }
        this.emitChange();
    }

    handleResetUserRegistrationStatus() {
        this.registrationStatus = 'guest';
        this.errorMessage = '';
        // this.emitChange();
    }

    handleUserRegistrationError(err) {
        let rawMessage = err.message.message ;
        if (rawMessage === undefined) {
            rawMessage = err.message;
        }
        this.errorMessage = this.extractMessage(rawMessage);
        this.registrationStatus = 'error';
        this.emitChange();
    }

    handleUserSignInError(err) {
        let rawMessage = JSON.parse(err.message).output.message;
        this.errorMessage = this.extractMessage(rawMessage);
        this.registrationStatus = 'error';
        this.emitChange();
    }

    extractMessage(raw) {
        const message = raw.substring(7, raw.length - 1);
        const message1 = message.replace(/\\\"/g, '"');
        let message2 = JSON.parse(message1).message;
        if (message2 === undefined) {
            message2 = JSON.parse(message1).error;
        }
        return message2;
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
    'CREATE_USER_FAILURE': 'handleUserRegistrationError',
    'SIGNIN_FAILURE': 'handleUserSignInError'
};

export default UserRegistrationStore;
