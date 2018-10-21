import {BaseStore} from 'fluxible/addons';

class GroupStatsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.datePeriod = 'LAST_7_DAYS';
        this.activityType = 'view';
        this.statsByTime = [];
        this.statsByTimeLoading = true;
    }

    updateStatsByTime(payload) {
        this.statsByTime = payload.statsByTime;
        this.statsByTimeLoading = false;
        this.emitChange();
    }

    updateDatePeriod(payload) {
        this.datePeriod = payload.datePeriod;
        this.emitChange();
    }

    updateActivityType(payload) {
        this.activityType = payload.activityType;
        this.emitChange();
    }

    setStatsByTimeLoading() {
        this.statsByTimeLoading = true;
        this.emitChange();
    }


    getState() {
        return {
            datePeriod: this.datePeriod,
            activityType: this.activityType,
            statsByTime: this.statsByTime,
            statsByTimeLoading: this.statsByTimeLoading,
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.datePeriod = state.datePeriod;
        this.activityType = state.activityType;
        this.statsByTime = state.statsByTime;
        this.statsByTimeLoading = state.statsByTimeLoading;
    }
}

GroupStatsStore.storeName = 'GroupStatsStore';
GroupStatsStore.handlers = {
    'UPDATE_GROUP_STATS_PERIOD': 'updateDatePeriod',
    'UPDATE_GROUP_STATS_ACTIVITY_TYPE': 'updateActivityType',
    'LOAD_GROUP_STATS_BY_TIME': 'updateStatsByTime',
    'SET_GROUP_STATS_BY_TIME_LOADING': 'setStatsByTimeLoading',
};

export default GroupStatsStore;
