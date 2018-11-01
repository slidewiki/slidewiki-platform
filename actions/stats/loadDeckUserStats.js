const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import DeckStatsStore from '../../stores/DeckStatsStore';


export default function loadDeckUserStats(context, payload, done) {
    let datePeriod = context.getStore(DeckStatsStore).membersStatsFilters.datePeriod;
    let activityType = context.getStore(DeckStatsStore).membersStatsFilters.activityType;

    log.info(context);

    context.dispatch('SET_DECK_USER_STATS_LOADING');

    context.service.read('stats.deckUserStats', {datePeriod, deckId: payload.deckId, activityType}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_DECK_USER_STATS', {deckUserStats: res});
        }
        done();
    });
}
