import {BaseStore} from 'fluxible/addons';

class ResetPasswordStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.errorMessage = '';
        this.componentStatus = 'guest';
        this.isLoading = false;
    }

    handleSuccess(res) {
        this.componentStatus = 'pending';
        this.errorMessage = '';
        this.isLoading = false;
        this.emitChange();
    }

    reset() {
        this.componentStatus = 'guest';
        this.errorMessage = '';
        this.isLoading = false;
        this.emitChange();
    }

    handleError(err) {
        let rawMessage = err.message.message ;
        if (rawMessage === undefined) {
            rawMessage = err.message;
        }
        this.errorMessage = this.extractMessage(rawMessage);
        this.componentStatus = 'error';
        this.isLoading = false;
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

    wrongAPIKeyUsed() {
        this.errorMessage = '';
        this.componentStatus = 'apikey';
        this.isLoading = false;
        this.emitChange();
    }

    unknownEMail(err) {
        this.errorMessage = '';
        this.componentStatus = 'email';
        this.isLoading = false;
        this.emitChange();
    }

    start() {
        this.isLoading = true;
        this.emitChange();
    }

    getState() {
        return {
            componentStatus: this.componentStatus,
            errorMessage: this.errorMessage,
            isLoading: this.isLoading
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.componentStatus = state.componentStatus;
        this.errorMessage = state.errorMessage;
        this.isLoading = state.isLoading;
    }
}

ResetPasswordStore.storeName = 'ResetPasswordStore';
ResetPasswordStore.handlers = {
    'RESET_PASSWORD_SUCCESS': 'handleSuccess',
    'RESET_RESET_PASSWORD': 'reset',
    //error handling
    'RESET_PASSWORD_FAILURE': 'handleError',
    'RESET_PASSWORD_WRONG_APIKEY': 'wrongAPIKeyUsed',
    'RESET_PASSWORD_UNKNOWN_EMAIL': 'unknownEMail',
    'RESET_PASSWORD_START': 'start'
};

export default ResetPasswordStore;
