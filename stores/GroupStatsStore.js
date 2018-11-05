import {BaseStore} from 'fluxible/addons';

class GroupStatsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.timelineFilters = {datePeriod: 'LAST_7_DAYS', activityType: 'view'};
        this.membersStatsFilters = {datePeriod: 'LAST_7_DAYS', activityType: 'view'};
        this.membersStats = [];
        this.membersStatsLoading = true;
        this.statsByTime = [];
        this.statsByTimeLoading = true;
    }

    updateStatsByTime(payload) {
        this.statsByTime = payload.statsByTime;
        this.statsByTimeLoading = false;
        this.emitChange();
    }

    updateMembersStats(payload) {
        this.membersStats = payload.membersStats;
        this.membersStatsLoading = false;
        this.emitChange();
    }
    updateTimelineFilters(payload) {
        this.timelineFilters.datePeriod = payload.datePeriod || this.timelineFilters.datePeriod;
        this.timelineFilters.activityType = payload.activityType || this.timelineFilters.activityType;
        this.emitChange();
    }

    updateMembersStatsFilters(payload) {
        this.membersStatsFilters.datePeriod = payload.datePeriod || this.membersStatsFilters.datePeriod;
        this.membersStatsFilters.activityType = payload.activityType || this.membersStatsFilters.activityType;
        this.emitChange();
    }

    setStatsByTimeLoading() {
        this.statsByTimeLoading = true;
        this.emitChange();
    }

    setMembersStatsLoading() {
        this.membersStatsLoading = true;
        this.emitChange();
    }


    getState() {
        return {
            timelineFilters: this.timelineFilters,
            statsByTime: this.statsByTime,
            statsByTimeLoading: this.statsByTimeLoading,
            membersStatsLoading: this.membersStatsLoading,
            membersStats: this.membersStats,
            membersStatsFilters: this.membersStatsFilters
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.timelineFilters = state.timelineFilters;
        this.statsByTime = state.statsByTime;
        this.statsByTimeLoading = state.statsByTimeLoading;
        this.membersStatsLoading = state.membersStatsLoading;
        this.membersStats = state.membersStats;
        this.membersStatsFilters = state.membersStatsFilters;
    }
}

GroupStatsStore.storeName = 'GroupStatsStore';
GroupStatsStore.handlers = {
    'UPDATE_GROUP_ACTIVITY_TIMELINE_FILTERS': 'updateTimelineFilters',
    'LOAD_GROUP_STATS_BY_TIME': 'updateStatsByTime',
    'SET_GROUP_STATS_BY_TIME_LOADING': 'setStatsByTimeLoading',
    'LOAD_GROUP_MEMBERS_STATS': 'updateMembersStats',
    'UPDATE_GROUP_MEMBERS_STATS_FILTERS': 'updateMembersStatsFilters',
    'SET_GROUP_MEMBERS_STATS_LOADING': 'setMembersStatsLoading',

};

export default GroupStatsStore;
