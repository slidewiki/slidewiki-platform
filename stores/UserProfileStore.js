import { BaseStore } from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.toShow = '';
        this.failures = {
            emailNotAllowed: false,
            wrongPassword: false
        };
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
            picture: '',
            description: ''
        };
        this.username = '';
        this.userid = '';
        this.jwt = '';
        this.userpicture = undefined;
        this.errorMessage = '';

        let user = dispatcher.getContext().getUser();
        console.log('UserProfileStore constructor:', user);
        try {
            this.jwt = user.jwt ? user.jwt : '';
            this.username = user.username ? user.username : '';
            this.userid = user.userid ? user.userid : '';
        } catch (e) {
            //empty user object
        }
    }

    destructor() {
        this.toShow = 'decks';
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
            picture: '',
            description: ''
        };
        this.userpicture = undefined;
    }

    getState() {
        return {
            toShow: this.toShow,
            failures: this.failures,
            user: this.user,
            dimmer: this.dimmer,
            username: this.username,
            userid: this.userid,
            jwt: this.jwt,
            userpicture: this.userpicture,
            errorMessage: this.errorMessage
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.toShow = state.toShow;
        this.failures = state.failures;
        this.user = state.user;
        this.dimmer = state.dimmer;
        this.username = state.username;
        this.userid = state.userid;
        this.jwt = state.jwt;
        this.userpicture = state.userpicture;
        this.errorMessage = state.errorMessage;
    }

    changeTo(payload) {
        this.toShow = payload.dest;
        this.emitChange();
    }

    userDeleted(payload) {
        this.destructor();
        this.emitChange();
    }

    successMessage() {
        this.dimmer.success = true;
        this.emitChange();
        this.dimmer.success = false;
    }

    fillInUser(payload) {
        if(this.username === payload.uname)
            this.userpicture = payload.picture;
        if(!payload.onlyPicture){
            Object.assign(this.user, payload);
            this.toShow = payload.category;
        }
        this.emitChange();
    }

    fillInEditedUser(payload) {
        Object.assign(this.user, payload);
        if(this.username === payload.uname)
            this.userpicture = payload.picture;
        this.successMessage();
    }

    actionFailed(payload) {
        this.dimmer.failure = true;
        this.emitChange();
        this.dimmer.failure = false;
    }

    emailNotAllowed(payload) {
        console.log('emailNotAllowed');
        this.failures.emailNotAllowed = true;
        this.emitChange();
        this.failures.emailNotAllowed = false;
    }

    wrongPassword() {
        console.log('wrongPassword');
        this.failures.wrongPassword = true;
        this.emitChange();
        this.failures.wrongPassword = false;
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
        this.userpicture = undefined;
        this.errorMessage = '';
        this.emitChange();
    }

    handleSignInError(err) {
        let rawMessage = JSON.parse(err.message)
            .output.message;
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
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'CHANGE_TO': 'changeTo',
    'DELETE_USER_SUCCESS': 'userDeleted',
    'DELETE_USER_FAILURE': 'actionFailed',
    'NEW_USER_DATA': 'fillInUser',
    'NEW_EDITED_USER_DATA': 'fillInEditedUser',
    'FETCH_USER_FAILED': 'actionFailed',
    'EDIT_USER_FAILED': 'actionFailed',
    'NEW_PASSWORD': 'successMessage',
    'EMAIL_NOT_ALLOWED': 'emailNotAllowed',
    'WRONG_PASSWORD': 'wrongPassword',
    'SIGNIN_SUCCESS': 'handleSignInSuccess',
    'SIGNIN_FAILURE': 'handleSignInError',
    'USER_SIGNOUT': 'handleSignOut'
};

export default UserProfileStore;
