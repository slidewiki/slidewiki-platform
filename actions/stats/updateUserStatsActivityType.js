import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import loadUserStatsByTime from '../stats/loadUserStatsByTime';


export default function updateUserStatsActivityType(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_USER_STATS_ACTIVITY_TYPE', payload);

    async.parallel([
        (callback) => {
            context.executeAction(loadUserStatsByTime, payload, callback);
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
