import { BaseStore } from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.toShow = 'decks';
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
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'CHANGE_TO': 'changeTo'
};

export default UserProfileStore;
