import { BaseStore } from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.toShow = 'settings';
        this.dimmer = {
            success: false,
            failure: false,
            userdeleted: false
        };
        this.user = {
            uname: '',
            fname: '',
            lname: '',
            email: '',
            language: '',
            country: '',
            organization: '',
            picture: ''
        };
        this.username = '';
        this.userid = '';
        this.jwt = '';
        this.errorMessage = '';
    }

    destructor() {
        this.toShow = 'deck';
        this.dimmer = {
            success: false,
            failure: false,
            userdeleted: false
        };
        this.user = {
            uname: '',
            fname: '',
            lname: '',
            email: '',
            language: '',
            country: '',
            organization: '',
            picture: ''
        };
    }

    getState() {
        return {
            toShow: this.toShow,
            user: this.user,
            dimmer: this.dimmer,
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
        this.toShow = state.toShow;
        this.user = state.user;
        this.dimmer = state.dimmer;
        this.username = state.username;
        this.userid = state.userid;
        this.jwt = state.jwt;
        this.errorMessage = state.errorMessage;
    }

    changeTo(payload) {
        this.toShow = payload.dest;
        this.emitChange();
    }

    userDeleted(payload){
        this.destructor();
        this.emitChange();
    }

    successMessage() {
        this.dimmer.success = true;
        this.emitChange();
        this.dimmer.success = false;
    }

    fillInUser(payload){
        let uname = this.user.uname;
        Object.assign(this.user, payload);
        this.emitChange();
        if(uname !== '')
            this.successMessage();
    }

    actionFailed(payload){
        this.dimmer.failure = true;
        this.emitChange();
        this.dimmer.failure = false;
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
        const message = raw.substring(7, raw.length - 1);
        const message1 = message.replace(/\\\"/g, '"');
        let message2 = JSON.parse(message1).message;
        if (message2 === undefined) {
            message2 = JSON.parse(message1).error;
        }
        return message2;
    }
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'CHANGE_TO': 'changeTo',
    'DELETE_USER_SUCCESS': 'userDeleted',
    'DELETE_USER_FAILURE': 'actionFailed',
    'NEW_USER_DATA': 'fillInUser',
    'EDIT_USER_FAILED': 'actionFailed',
    'NEW_PASSWORD': 'successMessage',
    'SIGNIN_SUCCESS': 'handleSignInSuccess',
    'SIGNIN_FAILURE': 'handleSignInError',
    'USER_SIGNOUT': 'handleSignOut'
};

export default UserProfileStore;
