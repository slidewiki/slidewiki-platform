const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import GroupStatsStore from '../../stores/GroupStatsStore';


export default function loadGroupStatsByTime(context, payload, done) {
    let datePeriod = context.getStore(GroupStatsStore).datePeriod;
    let activityType = context.getStore(GroupStatsStore).activityType;

    log.info(context);

    context.dispatch('SET_GROUP_STATS_BY_TIME_LOADING');

    context.service.read('stats.groupStatsByTime', {datePeriod, groupid: payload.groupid, activityType}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_GROUP_STATS_BY_TIME', {statsByTime: res});
        }
        done();
    });
}
