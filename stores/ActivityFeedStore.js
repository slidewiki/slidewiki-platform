import {BaseStore} from 'fluxible/addons';

class ActivityFeedStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.activities = [];
    }
    updateActivities(payload) {
        this.activities = payload.activities;
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
            activities: this.activities
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.activities = state.activities;
    }
}

ActivityFeedStore.storeName = 'ActivityFeedStore';
ActivityFeedStore.handlers = {
    'LOAD_ACTIVITIES_SUCCESS': 'updateActivities',
    'LIKE_ACTIVITY_SUCCESS': 'incrementLikes'
};

export default ActivityFeedStore;
