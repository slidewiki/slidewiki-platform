const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import GroupStatsStore from '../../stores/GroupStatsStore';


export default function loadGroupMembersStats(context, payload, done) {
    let datePeriod = context.getStore(GroupStatsStore).membersStatsFilters.datePeriod;
    let activityType = context.getStore(GroupStatsStore).membersStatsFilters.activityType;

    log.info(context);

    context.dispatch('SET_GROUP_MEMBERS_STATS_LOADING');

    context.service.read('stats.groupMembersStats', {datePeriod, groupid: payload.groupid, activityType}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_GROUP_MEMBERS_STATS', {membersStats: res});
        }
        done();
    });
}
