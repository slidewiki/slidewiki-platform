const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import DeckStatsStore from '../../stores/DeckStatsStore';


export default function loadDeckStatsByTime(context, payload, done) {
    let datePeriod = context.getStore(DeckStatsStore).timelineFilters.datePeriod;
    let activityType = context.getStore(DeckStatsStore).timelineFilters.activityType;

    log.info(context);

    context.dispatch('SET_DECK_STATS_BY_TIME_LOADING');

    context.service.read('stats.deckStatsByTime', {datePeriod, deckId: payload.deckId, activityType}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_DECK_STATS_BY_TIME', {statsByTime: res});
        }
        done();
    });
}
