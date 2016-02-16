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
    'LOAD_ACTIVITIES_SUCCESS': 'updateActivities'
};

export default ActivityFeedStore;
