import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import loadDeckUserStats from '../stats/loadDeckUserStats';


export default function updateDeckUserStatsFilters(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_DECK_USER_STATS_FILTERS', payload);

    async.parallel([
        (callback) => {
            context.executeAction(loadDeckUserStats, payload, callback);
        },
    ], (err, results) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        }
        done();
    });
}
