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
            uname: 'rmeissn',
            fname: '',
            lname: '',
            email: '',
            lang: '',
            location: '',
            hometown: '',
            orga: '',
            picture: ''
        };
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
            lang: '',
            location: '',
            hometown: '',
            orga: '',
            picture: ''
        };
    }

    getState() {
        return { toShow: this.toShow, user: this.user, dimmer: this.dimmer};
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.toShow = state.toShow;
        this.user = state.user;
        this.dimmer = state.dimmer;
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
        Object.assign(this.user, payload);
        this.successMessage();
    }

    actionFailed(payload){
        this.dimmer.failure = true;
        this.emitChange();
        this.dimmer.failure = false;
    }
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'CHANGE_TO': 'changeTo',
    'DELETE_USER_SUCCESS': 'userDeleted',
    'DELETE_USER_FAILURE': 'actionFailed',
    'NEW_USER_DATA': 'fillInUser',
    'EDIT_USER_FAILED': 'actionFailed',
    'NEW_PASSWORD': 'successMessage'
};

export default UserProfileStore;
