import {BaseStore} from 'fluxible/addons';

class UserNotificationsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.notifications = undefined;
        this.newNotificationsCount = 0;
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
    showLoading(){
        this.loading = true;
        this.emitChange();
    }
    loadNotifications(payload) {
        this.notifications = payload.notifications;
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
    readAllUserNotificationsSuccess() {
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
        if (payload.changedId === 0) {//activity type filter changed
            let changedActivityTypeFilter = this.activityTypes.find((at) => {return (at.type === payload.changedType);});
            if (changedActivityTypeFilter !== undefined) {
                changedActivityTypeFilter.selected = !changedActivityTypeFilter.selected;
                this.notifications.forEach((notification) => {
                    notification.visible = this.isActivityTypeSelected(notification.activity_type);
                });
            }
            this.emitChange();
        }
    }
    selectAllActivityTypes(payload) {
        this.activityTypes.forEach((at) => {at.selected = payload.value;});
        this.notifications.forEach((notification) => {
            notification.visible = this.isActivityTypeSelected(notification.activity_type);
        });

        this.emitChange();
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
            notification.visible = this.isActivityTypeSelected(notification.activity_type);
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
