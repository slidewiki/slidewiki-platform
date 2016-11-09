import { BaseStore } from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.category = undefined;
        this.categoryItem = undefined;
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
        this.userDecks = undefined;
        this.lastUser = '';
        this.username = '';
        this.userid = '';
        this.jwt = '';
        this.userpicture = undefined;
        this.errorMessage = '';
        this.socialLoginError = false;
        this.removeProviderError = false;
        this.addProviderError = false;
        this.providerAction = '';

        let user = dispatcher.getContext().getUser();
        //console.log('UserProfileStore constructor:', user);
        try {
            this.jwt = user.jwt ? user.jwt : '';
            this.username = user.username ? user.username : '';
            this.userid = user.userid ? user.userid : '';
        } catch (e) {
            //empty user object
        }

        //LoginModal
        this.showLoginModal = false;
    }

    destructor() {
        this.category = undefined;
        this.categoryItem = undefined;
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
        this.lastUser = '';
        this.userpicture = undefined;
        this.userDecks = [];
        this.socialLoginError = false;
        this.removeProviderError = false;
        this.addProviderError = false;
        this.providerAction = '';

        //LoginModal
        this.showLoginModal = false;
    }

    getState() {
        return {
            category: this.category,
            categoryItem: this.categoryItem,
            failures: this.failures,
            user: this.user,
            userDecks: this.userDecks,
            dimmer: this.dimmer,
            username: this.username,
            userid: this.userid,
            jwt: this.jwt,
            userpicture: this.userpicture,
            errorMessage: this.errorMessage,
            showLoginModal: this.showLoginModal,
            lastUser: this.lastUser,
            socialLoginError: this.socialLoginError,
            removeProviderError: this.removeProviderError,
            addProviderError: this.addProviderError,
            providerAction: this.providerAction
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.category = state.category;
        this.categoryItem = state.categoryItem;
        this.failures = state.failures;
        this.user = state.user;
        this.userDecks = state.userDecks;
        this.dimmer = state.dimmer;
        this.username = state.username;
        this.userid = state.userid;
        this.jwt = state.jwt;
        this.userpicture = state.userpicture;
        this.errorMessage = state.errorMessage;
        this.showLoginModal = state.showLoginModal;
        this.lastUser = state.lastUser;
        this.socialLoginError = state.socialLoginError;
        this.removeProviderError = state.removeProviderError;
        this.addProviderError = state.addProviderError;
        this.providerAction = state.providerAction;
    }

    changeTo(payload) {
        this.category = payload.category;
        this.categoryItem = payload.item;
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
            this.category = payload.category;
        }
        this.emitChange();
    }

    fillInEditedUser(payload) {
        Object.assign(this.user, payload);
        if(this.username === payload.uname)
            this.userpicture = payload.picture;
        this.successMessage();
    }

    fillInUserDecks(payload) {
        this.userDecks = [];
        Object.assign(this.userDecks, payload);
        this.lastUser = this.user.uname;
        this.emitChange();
    }

    actionFailed(payload) {
        this.dimmer.failure = true;
        this.emitChange();
        this.dimmer.failure = false;
    }

    emailNotAllowed(payload) {
        //console.log('emailNotAllowed');
        this.failures.emailNotAllowed = true;
        this.emitChange();
        this.failures.emailNotAllowed = false;
    }

    wrongPassword() {
        //console.log('wrongPassword');
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
        this.userDecks = undefined;
        this.emitChange();
    }

    handleSignInError(err) {
        let rawMessage = JSON.parse(err.message)
            .output.message;
        this.errorMessage = this.extractMessage(rawMessage);
        this.emitChange();
    }

    handleSocialSignInError(err) {
        this.socialLoginError = true;
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

    deleteSocialData() {
        this.socialLoginError = false;
        this.emitChange();
    }

    socialRegister(res) {
        this.userpicture = res.picture;

        this.handleSignInSuccess(res);
    }

    removeProviderSuccess(provider) {
        console.log('UserProfileStore removeProviderSuccess()', provider, this.user.providers);
        if (this.user.providers !== undefined && this.user.providers !== null && this.user.providers.length > 0)
            this.user.providers = this.user.providers.reduce((prev, cur) => {
                if (cur !== provider)
                    prev.push(cur);
                return prev;
            }, []);
        this.removeProviderError = false;
        this.providerAction = '';
        this.emitChange();
    }

    removeProviderFailure() {
        this.removeProviderError = true;
        this.providerAction = '';
        this.emitChange();
    }

    resetProviderStuff() {
        this.removeProviderError = false;
        this.addProviderError = false;
        this.providerAction = '';
        this.emitChange();
    }

    addProviderSucess(providerData) {
        console.log('UserProfileStore addProviderSucess()', providerData.provider, this.user.providers);
        this.addProviderError = false;
        if (this.user.providers === undefined || this.user.providers === null)
            this.user.providers = [];
        this.user.providers.push(providerData.provider);
        this.providerAction = '';
        this.emitChange();
    }

    addProviderFailure() {
        this.addProviderError = true;
        this.providerAction = '';
        this.emitChange();
    }

    updateProviderAction(action) {
        this.providerAction = action;
        this.emitChange();
    }
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'USER_CATEGORY': 'changeTo',
    'DELETE_USER_SUCCESS': 'userDeleted',
    'DELETE_USER_FAILURE': 'actionFailed',
    'NEW_USER_DATA': 'fillInUser',
    'NEW_EDITED_USER_DATA': 'fillInEditedUser',
    'NEW_USER_DECKS': 'fillInUserDecks',
    'FETCH_USER_FAILED': 'actionFailed',
    'EDIT_USER_FAILED': 'actionFailed',
    'NEW_PASSWORD': 'successMessage',
    'EMAIL_NOT_ALLOWED': 'emailNotAllowed',
    'WRONG_PASSWORD': 'wrongPassword',
    'SIGNIN_SUCCESS': 'handleSignInSuccess',
    'SIGNIN_FAILURE': 'handleSignInError',
    'SOCIAL_SIGNIN_FAILURE': 'handleSocialSignInError',
    'USER_SIGNOUT': 'handleSignOut',
    'DELETE_SOCIAL_DATA': 'deleteSocialData',
    //social
    'SOCIAL_SIGNIN_SUCCESS': 'socialRegister',
    'REMOVE_PROVIDER_SUCCESS': 'removeProviderSuccess',
    'REMOVE_PROVIDER_FAILURE': 'removeProviderFailure',
    'ADD_PROVIDER_SUCCESS': 'addProviderSucess',
    'ADD_PROVIDER_FAILURE': 'addProviderFailure',
    'RESET_PROVIDER_STUFF': 'resetProviderStuff',
    'UPDATE_PROVIDER_ACTION': 'updateProviderAction'
};

export default UserProfileStore;
