import {BaseStore} from 'fluxible/addons';

class UserNotificationsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.notifications = [];
        // this.visibleNotifications = [];
        this.subscriptions = [];
        this.selector = {};
    }
    loadNotifications(payload) {
        this.notifications = payload.notifications;
        // this.visibleNotifications = getVisibleNotifications(this.notifications);
        this.subscriptions = payload.subscriptions;
        this.addVisibleParameterToNotifications();
        this.selector = payload.selector;
        this.emitChange();
    }
    clearNotificationNewParameter(payload) {
        let notification = this.notifications.find((notification) => {return (notification.id === payload.id);});
        if (notification !== undefined) {
            notification.new = false;
            this.emitChange();
        }
    }
    updateNotificationsVisibility(payload) {
        this.subscriptions.map((subscription) => {
            if (subscription.type === payload.changedType && subscription.id === payload.changedId) {
                subscription.selected = !subscription.selected;
                for (let i = 0; i < this.notifications.length; i++) {
                    this.notifications[i].visible = this.isVisible(this.notifications[i], subscription);
                }
            }
        });

        this.emitChange();
    }
    isVisible(notification, changedSubscription) {
        switch (changedSubscription.type) {
            case 'user':
                if (changedSubscription.id === notification.user_id) {
                    return (changedSubscription.selected) ? changedSubscription.selected : this.isSubscribed(notification.content_kind, notification.content_id);
                }
                break;
            case 'slide':
                if (changedSubscription.id === notification.content_id) {
                    return (changedSubscription.selected) ? changedSubscription.selected : this.isSubscribed('user', notification.user_id);
                }
                break;
            case 'deck':
                if (changedSubscription.id === notification.content_id) {
                    return (changedSubscription.selected) ? changedSubscription.selected : this.isSubscribed('user', notification.user_id);
                }
                break;
            default:
                return true;
                break;
        }
    }
    isVisible(notification) {
        return this.isSubscribed(notification.content_kind, notification.content_id) || this.isSubscribed('user', notification.user_id);
    }
    isSubscribed(type, id) {
        let subscription = this.subscriptions.find((s) => {return ((s.type === type) && (s.id === id));});
        if (subscription === undefined) {//not found - not subscribed

            return false;
        }
        return subscription.selected;
    }
    addVisibleParameterToNotifications() {
        for (let i = 0; i < this.notifications.length; i++) {
            this.notifications[i].visible = this.isVisible(this.notifications[i]);
        }
    }

    //Remove duplicate notifications // TODO use in service
    getUniqueNotifications(notifications) {
        let uniqueNotifications = [];
        if (notifications !== undefined && notifications.length > 0) {
            uniqueNotifications.push(notifications[0]);

            for (let i = 1; i < notifications.length; i++) {
                let currentNotification = notifications[i];
                let unique = true;
                for (let j = uniqueNotifications.length - 1; j >= 0; j++) {
                    if (uniqueNotifications[j].timestamp === currentNotification.timestamp) {
                        if (uniqueNotifications[j].id === currentNotification.id) {
                            unique = false;
                            break;
                        }
                    } else {//notifications are sorted by timestamp, therefore further on there can't be duplicates of currentNotification
                        break;
                    }
                }
                if (unique) {
                    uniqueNotifications.push(currentNotification);
                }
            }
        }

        return uniqueNotifications;
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
    'UPDATE_NOTIFICATIONS_VISIBILITY': 'updateNotificationsVisibility',
    'CLEAR_NOTIFICATION_NEW_PARAMETER': 'clearNotificationNewParameter'
};

export default UserNotificationsStore;
