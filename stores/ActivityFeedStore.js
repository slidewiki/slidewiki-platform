import {BaseStore} from 'fluxible/addons';

class ActivityFeedStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.activityType = 'all';
        this.activities = [];
        this.selector = {};
        this.hasMore = true;
    }
    updateActivities(payload) {
        this.activities = payload.activities;
        this.activityType = payload.activityType;
        this.selector = payload.selector;
        this.hasMore = payload.hasMore;
        this.emitChange();
    }
    loadMoreActivities(payload) {
        this.activities = this.activities.concat(payload.activities);
        this.hasMore = payload.hasMore;
        // TODO: check if there is more elegant way to tell the component that action loadMoreActivities was executed
        this.wasFetch = true;
        this.emitChange();
        this.wasFetch = false;
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
    addCommentActivity(payload) {
        const comment = payload.comment;
        const activityType = (comment.parent_comment === undefined) ? 'comment' : 'reply';
        const newActivity = {
            activity_type: activityType,
            user_id: comment.user_id,
            content_id: comment.content_id,
            content_kind: comment.content_kind,
            content_name: comment.content_name,
            comment_info: {
                comment_id: comment.id,
                text: comment.title
            },
            author: comment.author
        };
        this.activities.unshift(newActivity);//add to the beginning
        if (this.isLocalStorageOn()) {
            localStorage.setItem('activitiesCount', this.activities.length);// save this to compare it later with rehydrated data
            console.log('setlocalstorage', localStorage.getItem('activitiesCount'));
        }

        this.emitChange();
    }
    isLocalStorageOn () {
        let mod = 'react-count';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    }
    getState() {
        return {
            activities: this.activities,
            activityType: this.activityType,
            selector: this.selector,
            hasMore: this.hasMore,
            wasFetch: this.wasFetch,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.activities = state.activities;
        this.activityType = state.activityType;
        this.selector = state.selector;
        this.hasMore = state.hasMore;
    }
}

ActivityFeedStore.storeName = 'ActivityFeedStore';
ActivityFeedStore.handlers = {
    'LOAD_ACTIVITIES_SUCCESS': 'updateActivities',
    'LOAD_MORE_ACTIVITIES_SUCCESS': 'loadMoreActivities',
    'UPDATE_ACTIVITY_TYPE_SUCCESS': 'updateActivityType',
    'LIKE_ACTIVITY_SUCCESS': 'incrementLikes',
    'ADD_COMMENT_SUCCESS': 'addCommentActivity',
    'ADD_REPLY_SUCCESS': 'addCommentActivity'
};

export default ActivityFeedStore;
