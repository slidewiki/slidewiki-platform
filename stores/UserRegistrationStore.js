import {BaseStore} from 'fluxible/addons';

class UserRegistrationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.registrationStatus = 'guest';
        this.errorMessage = '';
        this.failures = {
        };
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
        this.emitChange();
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

    extractMessage(raw) {
        const message = raw.substring(7, raw.length - 1);// There is an error code at the beginning (e.g. 422 - "{\"statusCode\":422,\"error\":\"Unprocessable Entity\",\"message\":\"The username is already taken\"}")
        const message1 = message.replace(/\\\"/g, '"');// replace \" with "
        let message2 = JSON.parse(message1).message;
        if (message2 === undefined) {// Some errors do not have the message parameter
            message2 = JSON.parse(message1).error;
        }
        return message2;
    }

    handleEmailChecked(payload) {
        this.failures.emailNotAllowed = payload.taken;
        this.emitChange();
    }

    getState() {
        return {
            registrationStatus: this.registrationStatus,
            failures: this.failures,
            errorMessage: this.errorMessage
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.registrationStatus = state.registrationStatus;
        this.failures = state.failures;
        this.errorMessage = state.errorMessage;
    }
}

UserRegistrationStore.storeName = 'UserRegistrationStore';
UserRegistrationStore.handlers = {
    'CREATE_USER_SUCCESS': 'handleCreateUserSuccess',
    'RESET_USER_REGISTRATION_STATUS': 'handleResetUserRegistrationStatus',
    'CHECK_EMAIL_SUCCESS': 'handleEmailChecked',
    //error handling
    'CREATE_USER_FAILURE': 'handleUserRegistrationError'
};

export default UserRegistrationStore;
