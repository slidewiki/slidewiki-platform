import {BaseStore} from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.username = '';
        this.userid = '';
        this.jwt = '';
        this.errorMessage = '';
    }

    handleSignInSuccess(payload) {
        this.username = payload.username;
        this.userid = payload.userid;
        this.jwt = payload.jwt;
        this.errorMessage = '';

        this.emitChange();
    }

    handleSignOut(payload) {
        this.username = '';
        this.userid = '';
        this.jwt = '';
        this.errorMessage = '';

        this.emitChange();
    }

    handleSignInError(err) {
        let rawMessage = JSON.parse(err.message).output.message;
        this.errorMessage = this.extractMessage(rawMessage);
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

    getState() {
        return {
            username: this.username,
            userid: this.userid,
            jwt: this.jwt,
            errorMessage: this.errorMessage
        };
    }

    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.username = state.username;
        this.userid = state.userid;
        this.jwt = state.jwt;
        this.errorMessage = state.errorMessage;
    }
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'SIGNIN_SUCCESS': 'handleSignInSuccess',
    'SIGNIN_FAILURE': 'handleSignInError',
    'USER_SIGNOUT': 'handleSignOut'
};

export default UserProfileStore;
