import {BaseStore} from 'fluxible/addons';

class UserNotificationsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.notifications = [];
        this.visibleNotifications = [];
        this.subscriptions = [];
        this.selector = {};
    }
    loadNotifications(payload) {
        this.notifications = payload.notifications;
        this.visibleNotifications = payload.notifications;
        this.subscriptions = ['slide:671','deck:66','user:1','user:2'];
        this.selector = payload.selector;
        this.emitChange();
    }
    updateNotificationsVisibility(payload) {
        this.subscriptions = payload.subscriptions;

        // UPDATE visibleNotifications

        this.emitChange();
    }
    getState() {
        return {
            notifications: this.notifications,
            visibleNotifications: this.visibleNotifications,
            subscriptions: this.subscriptions,
            selector: this.selector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.notifications = state.notifications;
        this.visibleNotifications = state.visibleNotifications;
        this.subscriptions = state.subscriptions;
        this.selector = state.selector;
    }
}

UserNotificationsStore.storeName = 'UserNotificationsStore';
UserNotificationsStore.handlers = {
    'LOAD_USER_NOTIFICATIONS_SUCCESS': 'loadNotifications',
    'UPDATE_NOTIFICATIONS_VISIBILITY': 'updateNotificationsVisibility'
};

export default UserNotificationsStore;
