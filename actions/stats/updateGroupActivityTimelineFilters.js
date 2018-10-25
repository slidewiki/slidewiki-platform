import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import loadGroupStatsByTime from '../stats/loadGroupStatsByTime';


export default function updateGroupStatsActivityType(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_GROUP_ACTIVITY_TIMELINE_FILTERS', payload);

    async.parallel([
        (callback) => {
            context.executeAction(loadGroupStatsByTime, payload, callback);
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
