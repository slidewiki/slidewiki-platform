const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserStatsStore from '../../stores/UserStatsStore';
import UserProfileStore from '../../stores/UserProfileStore';


export default function loadUserStatsByTime(context, payload, done) {
    let username = context.getStore(UserProfileStore).username;
    let datePeriod = context.getStore(UserStatsStore).datePeriod;
    let activityType = context.getStore(UserStatsStore).activityType;
    log.info(context);

    context.dispatch('SET_USER_STATS_BY_TIME_LOADING');

    context.service.read('stats.userStatsByTime', {datePeriod, username, activityType}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_USER_STATS_BY_TIME', {statsByTime: res});
        }
        done();
    });
}
