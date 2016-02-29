import {BaseStore} from 'fluxible/addons';

class ActivityFeedStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.activityType = 'all';
        this.activities = [];
        this.selector = {};
    }
    updateActivities(payload) {
        this.activities = payload.activities;
        this.activityType = payload.activityType;
        this.selector = payload.selector;
        this.emitChange();
    }
    updateActivityType(payload) {
        this.activityType = payload.activityType;
        this.emitChange();
    }
    incrementLikes(payload) {
        this.activities.forEach((activity) => {
            if (activity.id === payload.id) activity.likesNo++;
        });
        this.emitChange();
    }
    getState() {
        return {
            activities: this.activities,
            activityType: this.activityType,
            selector: this.selector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.activities = state.activities;
        this.activityType = state.activityType;
        this.selector = state.selector;
    }
}

ActivityFeedStore.storeName = 'ActivityFeedStore';
ActivityFeedStore.handlers = {
    'LOAD_ACTIVITIES_SUCCESS': 'updateActivities',
    'UPDATE_ACTIVITY_TYPE_SUCCESS': 'updateActivityType',
    'LIKE_ACTIVITY_SUCCESS': 'incrementLikes'
};

export default ActivityFeedStore;
