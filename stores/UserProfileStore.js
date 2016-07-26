import { BaseStore } from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.toShow = 'settings';
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
        this.userDeleted = false;
    }

    destructor() {
        this.toShow = 'deck';
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
        this.userDeleted = false;
    }

    getState() {
        return { toShow: this.toShow, user: this.user };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.toShow = state.toShow;
        this.user = state.user;
    }

    changeTo(payload) {
        this.toShow = payload.dest;
        this.emitChange();
    }

    userDeleted(payload){
        this.userDeleted = true;
        this.emitChange();
    }

    userDeleteFailed(payload){
    }

    fillInUser(payload){
        this.user = payload;
        this.emitChange();
    }
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'CHANGE_TO': 'changeTo',
    'DELETE_USER_SUCCESS': 'userDeleted',
    'DELETE_USER_FAILURE': 'userDeleteFailed',
    'NEW_USER_DATA': 'fillInUser',
    'EDIT_USER_FAILED': 'editUSERFailed'
};

export default UserProfileStore;
