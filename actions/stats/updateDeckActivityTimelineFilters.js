import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import loadDeckStatsByTime from '../stats/loadDeckStatsByTime';


export default function updateDeckStatsActivityType(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_DECK_ACTIVITY_TIMELINE_FILTERS', payload);

    async.parallel([
        (callback) => {
            context.executeAction(loadDeckStatsByTime, payload, callback);
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
