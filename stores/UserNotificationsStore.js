import {BaseStore} from 'fluxible/addons';

class UserNotificationsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.notifications = undefined;
        this.newNotificationsCount = 0;
        this.subscriptions = [];
        this.loading = true;
        this.activityTypes = [
            {type:'add', selected: true},
            {type:'edit', selected: true},
            {type:'move', selected: true},
            {type:'comment', selected: true},
            {type:'reply', selected: true},
            {type:'download', selected: true},
            {type:'share', selected: true},
            {type:'react', selected: true},
            // {type:'rate', selected: true},
            // {type:'translate', selected: true},
            {type:'use', selected: true},
            {type:'attach', selected: true},
            {type:'fork', selected: true},
            {type:'delete', selected: true},
            {type:'joined', selected: true},
            {type:'left', selected: true}
        ];
    }
    showLoading(payload){
        this.loading = true;
        this.emitChange();
    }
    loadNotifications(payload) {
        this.notifications = payload.notifications;
        this.subscriptions = payload.subscriptions;
        this.loading = false;

        this.newNotificationsCount = this.countNewNotifications();
        this.addVisibleParameterToNotifications();

        this.emitChange();
    }
    loadNewNotificationsCount(payload) {
        this.newNotificationsCount = payload.count;
        this.emitChange();
    }
    countNewNotifications() {
        let count = 0;
        this.notifications.forEach((notification) => {if (notification.new) count++;});
        return count;
    }
    readUserNotificationSuccess(payload) {
        let notification = this.notifications.find((notification) => {return (notification.id === payload.id);});
        if (notification !== undefined) {
            notification.new = false;
            this.newNotificationsCount--;
        }

        this.emitChange();
    }
    readAllUserNotificationsSuccess(payload) {
        this.notifications.forEach((notification) => {notification.new = false;});
        this.newNotificationsCount = 0;
        this.emitChange();
    }

    deleteUserNotification(payload) {
        let index = this.notifications.findIndex((notification) => {return (notification.id === payload.id);});
        if (index !== -1) {
            if (this.notifications[index].new) {
                this.newNotificationsCount--;
            }
            this.notifications.splice(index, 1);
        }

        this.emitChange();
    }

    deleteAllUserNotifications() {
        this.notifications = [];
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
    selectAllActivityTypes(payload) {
        this.activityTypes.forEach((at) => {at.selected = payload.value;});
        this.notifications.forEach((notification) => {
            notification.visible = this.isVisible(notification);
        });

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
            newNotificationsCount: this.newNotificationsCount,
            loading: this.loading,
            subscriptions: this.subscriptions,
            activityTypes: this.activityTypes
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.notifications = state.notifications;
        this.newNotificationsCount = state.newNotificationsCount;
        this.loading = state.loading;
        this.subscriptions = state.subscriptions;
        this.activityTypes = state.activityTypes;
    }
}

UserNotificationsStore.storeName = 'UserNotificationsStore';
UserNotificationsStore.handlers = {
    'LOAD_USER_NOTIFICATIONS_SUCCESS': 'loadNotifications',
    'LOAD_NEW_USER_NOTIFICATIONS_COUNT_SUCCESS': 'loadNewNotificationsCount',
    'UPDATE_NOTIFICATIONS_VISIBILITY': 'updateNotificationsVisibility',
    'SELECT_ALL_ACTIVITY_TYPES': 'selectAllActivityTypes',
    'DELETE_USER_NOTIFICATION_SUCCESS': 'deleteUserNotification',
    'DELETE_ALL_USER_NOTIFICATIONS_SUCCESS': 'deleteAllUserNotifications',
    'READ_ALL_USER_NOTIFICATIONS_SUCCESS': 'readAllUserNotificationsSuccess',
    'READ_USER_NOTIFICATION_SUCCESS': 'readUserNotificationSuccess',
    'SHOW_NOTIFICATIONS_LOADING': 'showLoading'
};

export default UserNotificationsStore;
