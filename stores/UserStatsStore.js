import {BaseStore} from 'fluxible/addons';

class UserStatsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.datePeriod = 'LAST_7_DAYS';
        this.activityType = 'view';
        this.statsByTime = [];
        this.statsByTag = [];
        this.chartHeight = 450;
    }

    updateStatsByTime(payload) {
        this.statsByTime = payload.statsByTime;
        this.emitChange();
    }

    updateStatsByTag(payload) {
        this.statsByTag = payload.statsByTag;
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

    getState() {
        return {
            datePeriod: this.datePeriod,
            activityType: this.activityType,
            statsByTime: this.statsByTime,
            statsByTag: this.statsByTag,
            chartHeight: this.chartHeight
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.datePeriod = state.datePeriod;
        this.activityType = state.activityType;
        this.statsByTime = state.statsByTime;
        this.statsByTag = state.statsByTag;
        this.chartHeight = state.chartHeight;
    }
}

UserStatsStore.storeName = 'UserStatsStore';
UserStatsStore.handlers = {
    'UPDATE_USER_STATS_PERIOD': 'updateDatePeriod',
    'UPDATE_USER_STATS_ACTIVITY_TYPE': 'updateActivityType',
    'LOAD_USER_STATS_BY_TIME': 'updateStatsByTime',
    'LOAD_USER_STATS_BY_TAG': 'updateStatsByTag'
};

export default UserStatsStore;
