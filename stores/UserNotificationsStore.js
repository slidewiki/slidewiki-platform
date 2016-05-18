import {BaseStore} from 'fluxible/addons';

class UserNotificationsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.notifications = [];
        this.selector = {};
    }
    loadNotifications(payload) {
        this.notifications = payload.notifications;
        this.selector = payload.selector;
        this.emitChange();
    }
    getState() {
        return {
            notifications: this.notifications,
            selector: this.selector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.notifications = state.notifications;
        this.selector = state.selector;
    }
}

UserNotificationsStore.storeName = 'UserNotificationsStore';
UserNotificationsStore.handlers = {
    'LOAD_USER_NOTIFICATIONS_SUCCESS': 'loadNotifications',
};

export default UserNotificationsStore;
