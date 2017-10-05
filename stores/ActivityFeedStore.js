import {BaseStore} from 'fluxible/addons';
import { isLocalStorageOn } from '../common.js';

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
    // incrementLikes(payload) {
    //     this.activities.forEach((activity) => {
    //         if (activity.id === payload.id) activity.likesNo++;
    //     });
    //     this.emitChange();
    // }
    // addCommentActivity(payload) {
    //     const comment = payload.comment;
    //     const activityType = (comment.parent_comment === undefined) ? 'comment' : 'reply';
    //     const newActivity = {
    //         activity_type: activityType,
    //         user_id: comment.user_id,
    //         content_id: comment.content_id,
    //         content_kind: comment.content_kind,
    //         content_name: comment.content_name,
    //         comment_info: {
    //             comment_id: comment.id,
    //             text: comment.title
    //         },
    //         author: comment.author
    //     };
    //     this.activities.unshift(newActivity);//add to the beginning
    //     if (isLocalStorageOn()) {
    //         localStorage.setItem('activitiesCount', this.activities.length);// save this to compare it later with rehydrated data
    //     }
    //
    //     this.emitChange();
    // }
    addActivity(payload) {
        const activity = payload.activity;
        if (this.selector.stype === activity.content_kind && this.selector.sid === activity.content_id) {
            this.activities.unshift(activity);//add to the beginning
            if (isLocalStorageOn()) {
                localStorage.setItem('activitiesCount', this.activities.length);// save this to compare it later with rehydrated data
            }

            this.emitChange();
        }
    }
    addActivities(payload) {
        payload.activities.forEach((activity) => {
            if (this.selector.stype === activity.content_kind && this.selector.sid === activity.content_id) {
                this.activities.unshift(activity);//add to the beginning
            }
        });
        if (isLocalStorageOn()) {
            localStorage.setItem('activitiesCount', this.activities.length);// save this to compare it later with rehydrated data
        }

        this.emitChange();
    }
    addLikeActivity(payload) {
        if (payload.selector.stype === 'deck') {
            let activity = {
                activity_type: 'react',
                user_id: payload.userid,
                author: {
                    username: payload.username
                },
                content_id:  payload.selector.sid,
                content_kind: 'deck',
                react_type: 'like',
                timestamp: new Date()
            };
            this.activities.unshift(activity);//add to the beginning
            if (isLocalStorageOn()) {
                localStorage.setItem('activitiesCount', this.activities.length);// save this to compare it later with rehydrated data
            }

            this.emitChange();
        }
    }
    removeLikeActivity(payload) {
        //find like activity and remove it
        if (payload.selector.stype === 'deck') {
            let i = 0;
            for(; i < this.activities.length; i++) {
                const activity = this.activities[i];
                if (activity.activity_type === 'react' && activity.user_id === payload.userid && activity.content_id === payload.selector.sid && activity.content_kind === 'deck') {
                    break;
                }
            }
            if (i < this.activities.length) {
                this.activities.splice(i, 1);
                this.emitChange();
            }
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
    // 'LIKE_ACTIVITY_SUCCESS': 'incrementLikes',
    // 'ADD_COMMENT_SUCCESS': 'addCommentActivity',
    // 'ADD_REPLY_SUCCESS': 'addCommentActivity',
    'ADD_ACTIVITY_SUCCESS': 'addActivity',
    'ADD_ACTIVITIES_SUCCESS': 'addActivities',
    'LIKE_ACTIVITY_SUCCESS': 'addLikeActivity',
    'DISLIKE_ACTIVITY_SUCCESS': 'removeLikeActivity'
};

export default ActivityFeedStore;
