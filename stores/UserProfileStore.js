import { BaseStore } from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.toShow = 'decks';
        this.userDeleted = false;
    }
    destructor() {
        this.toShow = '';
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
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'CHANGE_TO': 'changeTo',
    'DELETE_USER_SUCCESS': 'userDeleted',
    'DELETE_USER_FAILURE': 'userDeleteFailed'
};

export default UserProfileStore;
