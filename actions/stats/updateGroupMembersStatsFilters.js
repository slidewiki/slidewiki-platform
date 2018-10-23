import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import loadGroupMembersStats from '../stats/loadGroupMembersStats';


export default function updateGroupMembersStatsFilters(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_GROUP_MEMBERS_STATS_FILTERS', payload);

    async.parallel([
        (callback) => {
            context.executeAction(loadGroupMembersStats, payload, callback);
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
