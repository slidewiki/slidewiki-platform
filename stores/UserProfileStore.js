import { BaseStore } from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.toShow = 'decks';
        this.fname = '';
        this.lname = '';
        this.email = '';
        this.lang = '';
        this.location = '';
        this.hometown = '';
        this.bday = '';
        this.picture = '';
        this.userDeleted = false;
    }

    destructor() {
        this.toShow = 'deck';
        this.fname = '';
        this.lname = '';
        this.email = '';
        this.lang = '';
        this.location = '';
        this.hometown = '';
        this.bday = '';
        this.picture = '';
        this.userDeleted = false;
    }

    getState() {
        return { toShow: this.toShow };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.toShow = state.toShow;
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
        this.fname = '';
        this.lname = '';
        this.email = '';
        this.lang = '';
        this.location = '';
        this.hometown = '';
        this.bday = '';
        this.picture = '';
        this.emitChange();
    }
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'CHANGE_TO': 'changeTo',
    'DELETE_USER_SUCCESS': 'userDeleted',
    'DELETE_USER_FAILURE': 'userDeleteFailed'
};

export default UserProfileStore;
