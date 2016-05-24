import {BaseStore} from 'fluxible/addons';

class UserNotificationsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.notifications = [];
        this.newNotificationsCount = 0;
        this.subscriptions = [];
        this.selector = {};
    }
    loadNotifications(payload) {
        this.notifications = payload.notifications;
        this.newNotificationsCount = this.getNewNotificationsCount();
        this.subscriptions = payload.subscriptions;
        this.addVisibleParameterToNotifications();
        this.selector = payload.selector;
        this.emitChange();
    }
    clearNotificationNewParameter(payload) {
        let notification = this.notifications.find((notification) => {return (notification.id === payload.id);});
        if (notification !== undefined) {
            if (notification.new) {
                notification.new = false;
                this.newNotificationsCount--;
            }
            this.emitChange();
        }
    }
    clearAllNotificationsNewParameter(payload) {
        this.notifications.forEach((notification) => {notification.new =false;});
        this.newNotificationsCount = 0;
        this.emitChange();
    }
    getNewNotificationsCount() {
        let count = 0;
        this.notifications.forEach((notification) => {
            if (notification.new !== undefined && notification.new === true) {
                count++;
            }
        });
        return count;
    }
    updateNotificationsVisibility(payload) {
        let clickedSubscription = this.subscriptions.find((s) => {return (s.type === payload.changedType && s.id === payload.changedId);});
        if (clickedSubscription !== undefined) {
            clickedSubscription.selected = !clickedSubscription.selected;
            this.notifications.forEach((notification) => {
                // notification.visible = this.isVisibleWhenChangedSubscription(notification, clickedSubscription);
                notification.visible = this.isVisible(notification);
            });
        }

        this.emitChange();
    }
    // isVisibleWhenChangedSubscription(notification, changedSubscription) {
    //     switch (changedSubscription.type) {
    //         case 'user':
    //             if (changedSubscription.id === notification.user_id) {
    //                 return (changedSubscription.selected) ? changedSubscription.selected : this.isSubscribed(notification.content_kind, notification.content_id);
    //             }
    //             break;
    //         case 'slide':
    //             if (changedSubscription.id === notification.content_id) {
    //                 return (changedSubscription.selected) ? changedSubscription.selected : this.isSubscribed('user', notification.user_id);
    //             }
    //             break;
    //         case 'deck':
    //             if (changedSubscription.id === notification.content_id) {
    //                 return (changedSubscription.selected) ? changedSubscription.selected : this.isSubscribed('user', notification.user_id);
    //             }
    //             break;
    //         default:
    //             return true;
    //     }
    // }
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
        this.notifications.forEach((notification) => {
            notification.visible = this.isVisible(notification);
        });
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
            newNotificationsCount: this.newNotificationsCount,
            subscriptions: this.subscriptions,
            selector: this.selector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.notifications = state.notifications;
        this.newNotificationsCount = state.newNotificationsCount;
        this.subscriptions = state.subscriptions;
        this.selector = state.selector;
    }
}

UserNotificationsStore.storeName = 'UserNotificationsStore';
UserNotificationsStore.handlers = {
    'LOAD_USER_NOTIFICATIONS_SUCCESS': 'loadNotifications',
    'UPDATE_NOTIFICATIONS_VISIBILITY': 'updateNotificationsVisibility',
    'CLEAR_NOTIFICATION_NEW_PARAMETER': 'clearNotificationNewParameter',
    'CLEAR_ALL_NOTIFICATIONS_NEW_PARAMETER': 'clearAllNotificationsNewParameter'
};

export default UserNotificationsStore;
