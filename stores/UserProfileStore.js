import { BaseStore } from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.toShow = 'decks';
    }
    destructor() {
        this.toShow = '';
    }
    changeTo(payload) {
        this.toShow = payload.dest;
        this.emitChange();
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
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'CHANGE_TO': 'changeTo'
};

export default UserProfileStore;
