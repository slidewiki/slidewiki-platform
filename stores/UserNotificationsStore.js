import {BaseStore} from 'fluxible/addons';

class UserNotificationsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.notifications = undefined;
        this.newNotifications = [];
        this.newNotificationsCount = 0;
        this.subscriptions = [];
        this.activityTypes = [
            {type:'add', selected: true},
            {type:'edit', selected: true},
            {type:'comment', selected: true},
            {type:'reply', selected: true},
            {type:'download', selected: true},
            {type:'share', selected: true},
            {type:'react', selected: true},
            // {type:'rate', selected: true},
            // {type:'translate', selected: true},
            {type:'use', selected: true},
            {type:'fork', selected: true},
            {type:'delete', selected: true},
            {type:'joined', selected: true},
            {type:'left', selected: true}
        ];
    }
    loadNotifications(payload) {
        this.notifications = payload.notifications;
        this.newNotifications = payload.newNotifications;
        this.subscriptions = payload.subscriptions;

        this.markNewNotifications();
        this.newNotificationsCount = this.newNotifications.length;
        this.addVisibleParameterToNotifications();

        this.emitChange();
    }
    loadNewNotifications(payload) {
        this.newNotifications = payload.newNotifications;
        this.newNotificationsCount = this.newNotifications.length;
        this.emitChange();
    }
    loadNewNotificationsCount(payload) {
        this.newNotificationsCount = payload.count;
        this.emitChange();
    }
    markNewNotifications() {
        let invalidNewNotificationsIndexes = [];
        for (let i = 0; i < this.newNotifications.length; i++) {
            let newNotification = this.newNotifications[i];

            //find the matching item in notifications array
            let notification;
            for(let j = 0; j < this.notifications.length; j++) {
                if (this.notifications[j].id === newNotification.activity_id) {
                    notification = this.notifications[j];
                    break;
                }
            }
            if (notification !== undefined) {
                notification.newNotificationId = newNotification.id;
            } else {
                invalidNewNotificationsIndexes.push(i);
            }
        }

        //remove invalid new notifications
        for (let i = invalidNewNotificationsIndexes.length - 1; i >=0; i--) {
            this.newNotifications.splice(invalidNewNotificationsIndexes[i], 1);
        }

    }
    clearNotificationNewParameter(payload) {
        let index = this.newNotifications.findIndex((newNotification) => {return (newNotification.id === payload.newNotificationId);});
        if (index >= 0) {
            this.newNotifications.splice(index, 1);

            let notification = this.notifications.find((notification) => {return (notification.newNotificationId === payload.newNotificationId);});
            if (notification !== undefined) {
                notification.newNotificationId = '';
            }

            this.emitChange();
        }
        this.newNotificationsCount = this.newNotifications.length;
    }
    clearAllNotificationsNewParameter(payload) {
        this.notifications.forEach((notification) => {notification.newNotificationId = '';});
        this.newNotifications = [];
        this.newNotificationsCount = 0;
        this.emitChange();
    }
    updateNotificationsVisibility(payload) {
        let clickedSubscription = (payload.changedId === 0) ? this.activityTypes.find((at) => {return (at.type === payload.changedType);}) : this.subscriptions.find((s) => {return (s.type === payload.changedType && s.id === payload.changedId);});
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
        return (this.isSubscribed(notification.content_kind, notification.content_id) || this.isSubscribed('user', notification.user_id) || this.isSubscribed('owner', notification.content_owner_id)) && this.isActivityTypeSelected(notification.activity_type);
    }
    isSubscribed(type, id) {
        let subscription = this.subscriptions.find((s) => {return ((s.type === type) && (s.id === id));});
        if (subscription === undefined) {//not found - not subscribed
            return false;
        }
        return subscription.selected;
    }
    isActivityTypeSelected(type) {
        let activityType = this.activityTypes.find((at) => {return ((at.type === type));});
        if (activityType === undefined) {//not found
            return false;
        }
        return activityType.selected;
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
            newNotificationsCount: this.newNotificationsCount,
            subscriptions: this.subscriptions,
            activityTypes: this.activityTypes
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.notifications = state.notifications;
        this.newNotifications = state.newNotifications;
        this.newNotificationsCount = state.newNotificationsCount;
        this.subscriptions = state.subscriptions;
        this.activityTypes = state.activityTypes;
    }
}

UserNotificationsStore.storeName = 'UserNotificationsStore';
UserNotificationsStore.handlers = {
    'LOAD_USER_NOTIFICATIONS_SUCCESS': 'loadNotifications',
    'LOAD_NEW_USER_NOTIFICATIONS_SUCCESS': 'loadNewNotifications',
    'LOAD_NEW_USER_NOTIFICATIONS_COUNT_SUCCESS': 'loadNewNotificationsCount',
    'UPDATE_NOTIFICATIONS_VISIBILITY': 'updateNotificationsVisibility',
    'DELETE_USER_NOTIFICATION_SUCCESS': 'clearNotificationNewParameter',
    'DELETE_ALL_USER_NOTIFICATIONS_SUCCESS': 'clearAllNotificationsNewParameter'
};

export default UserNotificationsStore;
