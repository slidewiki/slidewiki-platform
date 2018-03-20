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
        this.addProviderAlreadyUsedError = false;
        this.providerAction = '';
        this.currentUsergroup = {};
        this.saveUsergroupError = '';
        this.saveUsergroupIsLoading = false;
        this.saveProfileIsLoading = false;
        this.deleteUsergroupError = '';
        this.usergroupsViewStatus = '';

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
        this.addProviderAlreadyUsedError = false;
        this.providerAction = '';
        this.currentUsergroup = {};
        this.saveUsergroupError = '';
        this.saveUsergroupIsLoading = false;
        this.saveProfileIsLoading = false;
        this.deleteUsergroupError = '';
        this.usergroupsViewStatus = '';

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
            providerAction: this.providerAction,
            addProviderAlreadyUsedError: this.addProviderAlreadyUsedError,
            currentUsergroup: this.currentUsergroup,
            saveUsergroupError: this.saveUsergroupError,
            saveUsergroupIsLoading: this.saveUsergroupIsLoading,
            saveProfileIsLoading: this.saveProfileIsLoading,
            deleteUsergroupError: this.deleteUsergroupError,
            usergroupsViewStatus: this.usergroupsViewStatus
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
        this.addProviderAlreadyUsedError = state.addProviderAlreadyUsedError;
        this.currentUsergroup = state.currentUsergroup;
        this.saveUsergroupError = state.saveUsergroupError;
        this.saveUsergroupIsLoading = state.saveUsergroupIsLoading;
        this.saveProfileIsLoading = state.saveProfileIsLoading;
        this.deleteUsergroupError = state.deleteUsergroupError;
        this.usergroupsViewStatus = state.usergroupsViewStatus;
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
        this.saveProfileIsLoading = false;
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
        this.saveProfileIsLoading = false;
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
        this.errorMessage = err.message;
        this.emitChange();
    }

    handleSocialSignInError(err) {
        this.socialLoginError = true;
        this.emitChange();
        this.socialLoginError = false;
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
        this.addProviderAlreadyUsedError = false;
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

    addProviderFailure(error) {
        if (error.message.startsWith('409'))
            this.addProviderAlreadyUsedError = true;
        else
            this.addProviderError = true;
        this.providerAction = '';
        this.emitChange();
    }

    updateProviderAction(action) {
        this.providerAction = action;
        this.emitChange();
    }

    updateUsergroup(group) {
        this.currentUsergroup = group;
        // console.log('UserProfileStore: updateUsergroup', group);
        this.saveUsergroupError = '';
        this.deleteUsergroupError = '';
        this.emitChange();
    }

    saveUsergroupFailed(error) {
        this.saveUsergroupIsLoading = false;
        this.saveUsergroupError = error.message;
        this.emitChange();
    }

    saveUsergroupSuccess() {
        this.saveUsergroupIsLoading = false;
        this.currentUsergroup = {};
        this.saveUsergroupError = '';
        this.emitChange();
    }

    saveUsergroupStart() {
        this.saveUsergroupIsLoading = true;
        this.emitChange();
    }

    saveProfileStart() {
        this.saveProfileIsLoading = true;
        this.emitChange();
    }

    deleteUsergroupFailed(error) {
        this.deleteUsergroupError = {
            action: 'delete',
            message: error.message
        };
        this.usergroupsViewStatus = '';
        this.emitChange();
    }

    deleteUsergroupSuccess(groupid) {
        console.log('UserProfileStore deleteUsergroupSuccess: delete % from %', groupid, this.user.groups);
        //remove group from user
        let groups = this.user.groups.reduce((prev, curr) => {
            if (curr._id.toString() !== groupid.toString())
                prev.push(curr);
            return prev;
        }, []);
        this.user.groups = groups;
        this.deleteUsergroupError = '';
        this.usergroupsViewStatus = '';
        this.emitChange();
    }

    updateUsergroupsStatus() {
        this.usergroupsViewStatus = 'pending';
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
    //social
    'SOCIAL_SIGNIN_SUCCESS': 'socialRegister',
    'REMOVE_PROVIDER_SUCCESS': 'removeProviderSuccess',
    'REMOVE_PROVIDER_FAILURE': 'removeProviderFailure',
    'ADD_PROVIDER_SUCCESS': 'addProviderSucess',
    'ADD_PROVIDER_FAILURE': 'addProviderFailure',
    'RESET_PROVIDER_STUFF': 'resetProviderStuff',
    'UPDATE_PROVIDER_ACTION': 'updateProviderAction',
    'USER_SIGNOUT': 'handleSignOut',
    'UPDATE_USERGROUP': 'updateUsergroup',
    'SAVE_USERGROUP_START': 'saveUsergroupStart',
    'SAVE_USERGROUP_FAILED': 'saveUsergroupFailed',
    'SAVE_USERGROUP_SUCCESS': 'saveUsergroupSuccess',
    'DELETE_USERGROUP_FAILED': 'deleteUsergroupFailed',
    'DELETE_USERGROUP_SUCCESS': 'deleteUsergroupSuccess',
    'UPDATE_USERGROUPS_STATUS': 'updateUsergroupsStatus',
    'LEAVE_USERGROUP_FAILED': 'deleteUsergroupFailed',
    'LEAVE_USERGROUP_SUCCESS': 'deleteUsergroupSuccess',
    'SAVE_USERPROFILE_START': 'saveProfileStart'
};

export default UserProfileStore;
