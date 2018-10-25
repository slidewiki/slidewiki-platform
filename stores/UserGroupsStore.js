import { BaseStore } from 'fluxible/addons';

class UserGroupsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.category = undefined;
        this.failures = {
            emailNotAllowed: false,
            wrongPassword: false
        };
        this.dimmer = {
            success: false,
            failure: false
        };
        this.userDecks = undefined;
        this.userDecksMeta = {};
        this.nextUserDecksLoading = false;
        this.nextUserDecksError = false;
        this.errorMessage = '';
        this.currentUsergroup = {
            creator: {},
            members: []
        };
        this.saveUsergroupError = '';
        this.saveUsergroupIsLoading = false;
        this.deleteUsergroupError = '';
        this.usergroupsViewStatus = '';
        this.leaveUsergroupError = '';
    }

    destructor() {
        this.category = undefined;
        this.failures = {
            emailNotAllowed: false,
            wrongPassword: false
        };
        this.dimmer = {
            success: false,
            failure: false
        };
        this.userDecks = undefined;
        this.userDecksMeta = {};
        this.nextUserDecksLoading = false;
        this.nextUserDecksError = false;
        this.errorMessage = '';
        this.currentUsergroup = {
            creator: {},
            members: []
        };
        this.saveUsergroupError = '';
        this.saveUsergroupIsLoading = false;
        this.deleteUsergroupError = '';
        this.usergroupsViewStatus = '';
        this.leaveUsergroupError = '';
    }

    getState() {
        return {
            category: this.category,
            failures: this.failures,
            dimmer: this.dimmer,
            userDecks: this.userDecks,
            userDecksMeta: this.userDecksMeta,
            nextUserDecksLoading: this.nextUserDecksLoading,
            nextUserDecksError: this.nextUserDecksError,
            errorMessage: this.errorMessage,
            currentUsergroup: this.currentUsergroup,
            saveUsergroupError: this.saveUsergroupError,
            saveUsergroupIsLoading: this.saveUsergroupIsLoading,
            saveProfileIsLoading: this.saveProfileIsLoading,
            deleteUsergroupError: this.deleteUsergroupError,
            usergroupsViewStatus: this.usergroupsViewStatus,
            leaveUsergroupError: this.leaveUsergroupError
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.category = state.category;
        this.failures = state.failures;
        this.userDecks = state.userDecks;
        this.userDecksMeta = state.userDecksMeta;
        this.nextUserDecksLoading = state.nextUserDecksLoading;
        this.nextUserDecksError = state.nextUserDecksError;
        this.dimmer = state.dimmer;
        this.errorMessage = state.errorMessage;
        this.currentUsergroup = state.currentUsergroup;
        this.saveUsergroupError = state.saveUsergroupError;
        this.saveUsergroupIsLoading = state.saveUsergroupIsLoading;
        this.deleteUsergroupError = state.deleteUsergroupError;
        this.usergroupsViewStatus = state.usergroupsViewStatus;
        this.leaveUsergroupError = state.leaveUsergroupError;
    }

    changeTo(category) {
        this.category = category;
        // console.log('UserGroupsStore: changeTo', category);
        this.emitChange();
    }

    updateUsergroup(group) {
        this.currentUsergroup = group;
        // console.log('UserGroupsStore: updateUsergroup', group);
        this.saveUsergroupError = '';
        this.deleteUsergroupError = '';
        this.emitChange();
    }

    error(error) {
        this.errorMessage = error.message;
        this.emitChange();
    }

    saveUsergroupStart() {
        this.saveUsergroupIsLoading = true;
        this.emitChange();
    }

    saveUsergroupFailed(error) {
        this.saveUsergroupIsLoading = false;
        this.saveUsergroupError = error.message;
        this.emitChange();
    }

    saveUsergroupSuccess(res) {
        this.saveUsergroupIsLoading = false;
        this.saveUsergroupError = '';
        this.currentUsergroup = res;
        this.emitChange();
    }

    updateUsergroupsStatus() {
        this.usergroupsViewStatus = 'pending';
        this.emitChange();
    }

    deleteUsergroupFailed(error) {
        this.deleteUsergroupError = error.message;
        this.usergroupsViewStatus = '';
        this.emitChange();
    }

    deleteUsergroupSuccess(groupid) {
        this.deleteUsergroupError = '';
        this.usergroupsViewStatus = '';
        this.emitChange();
    }

    leaveUsergroupFailed(error) {
        this.leaveUsergroupError = error.message;
        this.usergroupsViewStatus = '';
        this.emitChange();
    }

    leaveUsergroupSuccess(groupid) {
        this.leaveUsergroupError = '';
        this.usergroupsViewStatus = '';
        this.emitChange();
    }

    failureUploadingPicture(error) {
        this.saveUsergroupIsLoading = false;
        this.saveUsergroupError = error;
    }

/*

    // Old unchecked code





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
        this.userDecks = payload.decks;
        this.userDecksMeta = payload.metadata;
        this.lastUser = this.user.uname;
        this.emitChange();
    }

    actionFailed(payload) {
        this.dimmer.failure = true;
        this.saveProfileIsLoading = false;
        this.emitChange();
        this.dimmer.failure = false;
    }

    saveProfileStart() {
        this.saveProfileIsLoading = true;
        this.emitChange();
    }

    setUserDecksLoading(){
        this.userDecks = undefined;
        // preserve sorting of sort dropdown during loading
        this.userDecksMeta = {
            sort: this.userDecksMeta.sort
        };
        this.emitChange();
    }

    setNextUserDecksLoading(){
        this.nextUserDecksLoading = true;
        this.emitChange();
    }

    fetchNextUserDecks(payload){
        this.userDecks = this.userDecks.concat(payload.decks);
        this.userDecksMeta = payload.metadata;
        this.nextUserDecksLoading = false;
        this.nextUserDecksError = false;
        this.emitChange();
    }

    fetchNextUserDecksFailed(){
        this.nextUserDecksError = true;
        this.nextUserDecksLoading = false;
        this.emitChange();
        this.nextUserDecksError = false;
    }

    */
}

UserGroupsStore.storeName = 'UserGroupsStore';
UserGroupsStore.handlers = {
    'USERGROUP_CATEGORY': 'changeTo',
    'UPDATE_USERGROUP': 'updateUsergroup',
    'USERGROUP_ERROR': 'error',
    'SAVE_USERGROUP_START': 'saveUsergroupStart',
    'SAVE_USERGROUP_FAILED': 'saveUsergroupFailed',
    'SAVE_USERGROUP_SUCCESS': 'saveUsergroupSuccess',
    'UPDATE_USERGROUPS_STATUS': 'updateUsergroupsStatus',
    'DELETE_USERGROUP_FAILED': 'deleteUsergroupFailed',
    'DELETE_USERGROUP_SUCCESS': 'deleteUsergroupSuccess',
    'LEAVE_USERGROUP_FAILED': 'leaveUsergroupFailed',
    'LEAVE_USERGROUP_SUCCESS': 'leaveUsergroupSuccess',
    'FAILURE_UPLOADING_MEDIA_FILE': 'failureUploadingPicture'

/*
    //old ones

    'DELETE_USER_SUCCESS': 'userDeleted',
    'DELETE_USER_FAILURE': 'actionFailed',
    'NEW_USER_DATA': 'fillInUser',
    'NEW_EDITED_USER_DATA': 'fillInEditedUser',
    'NEW_USER_DECKS': 'fillInUserDecks',
    'NEW_USER_DECKS_LOADING': 'setUserDecksLoading',

    // loading more decks
    'FETCH_NEXT_USER_DECKS_LOADING': 'setNextUserDecksLoading',
    'FETCH_NEXT_USER_DECKS': 'fetchNextUserDecks',
    'FETCH_NEXT_USER_DECKS_FAILED': 'fetchNextUserDecksFailed',

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
    'SAVE_USERPROFILE_START': 'saveProfileStart',
    'SHOW_DEACTIVATE_ACCOUNT_MODAL': 'showDeactivateModal',
    'HIDE_DEACTIVATE_ACCOUNT_MODAL': 'hideDeactivateModal'*/
};

export default UserGroupsStore;
