import {BaseStore} from 'fluxible/addons';

class DeckStatsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.timelineFilters = {datePeriod: 'LAST_7_DAYS', activityType: 'view'};
        this.deckUserStatsFilters = {datePeriod: 'LAST_7_DAYS', activityType: 'view'};
        this.deckUserStats = [];
        this.deckUserStatsLoading = true;
        this.statsByTime = [];
        this.statsByTimeLoading = true;
    }

    updateStatsByTime(payload) {
        this.statsByTime = payload.statsByTime;
        this.statsByTimeLoading = false;
        this.emitChange();
    }

    updateDeckUserStats(payload) {
        this.deckUserStats = payload.deckUserStats;
        this.deckUserStatsLoading = false;
        this.emitChange();
    }
    updateTimelineFilters(payload) {
        this.timelineFilters.datePeriod = payload.datePeriod || this.timelineFilters.datePeriod;
        this.timelineFilters.activityType = payload.activityType || this.timelineFilters.activityType;
        this.emitChange();
    }

    updateDeckUserStatsFilters(payload) {
        this.deckUserStatsFilters.datePeriod = payload.datePeriod || this.deckUserStatsFilters.datePeriod;
        this.deckUserStatsFilters.activityType = payload.activityType || this.deckUserStatsFilters.activityType;
        this.emitChange();
    }

    setStatsByTimeLoading() {
        this.statsByTimeLoading = true;
        this.emitChange();
    }

    setDeckUserStatsLoading() {
        this.deckUserStatsLoading = true;
        this.emitChange();
    }


    getState() {
        return {
            timelineFilters: this.timelineFilters,
            statsByTime: this.statsByTime,
            statsByTimeLoading: this.statsByTimeLoading,
            deckUserStatsLoading: this.deckUserStatsLoading,
            deckUserStats: this.deckUserStats,
            deckUserStatsFilters: this.deckUserStatsFilters
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.timelineFilters = state.timelineFilters;
        this.statsByTime = state.statsByTime;
        this.statsByTimeLoading = state.statsByTimeLoading;
        this.deckUserStatsLoading = state.deckUserStatsLoading;
        this.deckUserStats = state.deckUserStats;
        this.deckUserStatsFilters = state.deckUserStatsFilters;
    }
}

DeckStatsStore.storeName = 'DeckStatsStore';
DeckStatsStore.handlers = {
    'UPDATE_DECK_ACTIVITY_TIMELINE_FILTERS': 'updateTimelineFilters',
    'LOAD_DECK_STATS_BY_TIME': 'updateStatsByTime',
    'SET_DECK_STATS_BY_TIME_LOADING': 'setStatsByTimeLoading',
    'LOAD_DECK_USER_STATS': 'updateDeckUserStats',
    'UPDATE_DECK_USER_STATS_FILTERS': 'updateDeckUserStatsFilters',
    'SET_DECK_USER_STATS_LOADING': 'setDeckUserStatsLoading',

};

export default DeckStatsStore;
