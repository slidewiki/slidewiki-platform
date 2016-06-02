import {BaseStore} from 'fluxible/addons';

class UserNotificationsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.notifications = [];
        this.newNotifications = [];
        this.subscriptions = [];
    }
    loadNotifications(payload) {
        this.notifications = payload.notifications;
        this.markNewNotifications();


        // this.newNotifications = payload.newNotifications;



        this.subscriptions = payload.subscriptions;
        this.addVisibleParameterToNotifications();
        this.emitChange();
    }
    loadNewNotifications(payload) {
        this.newNotifications = payload.newNotifications;
        this.emitChange();
    }
    markNewNotifications() {
        this.newNotifications.forEach((newNotification) => {
            let notification = this.notifications.find((notification) => {return (notification.id === newNotification.activity_id);});
            if (notification !== undefined) {
                notification.notificationId = newNotification.id;
            }
        });
    }
    clearNotificationNewParameter(payload) {
        let notification = this.notifications.find((notification) => {return (notification.newNotificationId === payload.newNotificationId);});
        if (notification !== undefined) {

            notification.newNotificationId = '';

            let index = this.newNotifications.findIndex((notification) => {return (notification.newNotificationId === payload.newNotificationId);});
            newNotifications.splice(index, 1);
            this.emitChange();
        }
    }
    clearAllNotificationsNewParameter(payload) {
        this.notifications.forEach((notification) => {notification.newNotificationId = '';});
        this.newNotifications = [];

        this.emitChange();
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
            newNotifications: this.newNotifications,
            subscriptions: this.subscriptions
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.notifications = state.notifications;
        this.newNotifications = state.newNotifications;
        this.subscriptions = state.subscriptions;
    }
}

UserNotificationsStore.storeName = 'UserNotificationsStore';
UserNotificationsStore.handlers = {
    'LOAD_USER_NOTIFICATIONS_SUCCESS': 'loadNotifications',
    'LOAD_NEW_USER_NOTIFICATIONS_SUCCESS': 'loadNewNotifications',
    'UPDATE_NOTIFICATIONS_VISIBILITY': 'updateNotificationsVisibility',
    'DELETE_USER_NOTIFICATION_SUCCESS': 'clearNotificationNewParameter',
    'DELETE_ALL_USER_NOTIFICATIONS_SUCCESS': 'clearAllNotificationsNewParameter'
};

export default UserNotificationsStore;
