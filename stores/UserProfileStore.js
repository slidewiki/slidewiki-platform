import { BaseStore } from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.toShow = '';
    }
    destructor() {
        this.toShow = '';
    }
    changeToMyDecks(payload) {
        this.toShow = 'decks';
        this.emitChange();
    }
    changeToSettings(payload) {
        this.toShow = 'settings';
        this.emitChange();
    }
    changeToMyStats(payload) {
        this.toShow = 'stats';
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
    'CHANGE_TO_MYDECKS': 'changeToMyDecks',
    'CHANGE_TO_SETTINGS': 'changeToSettings',
    'CHANGE_TO_MYSTATS': 'changeToMyStats'
};

export default UserProfileStore;
