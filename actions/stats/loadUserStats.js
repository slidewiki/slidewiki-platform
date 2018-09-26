import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import loadActivityStatsByTime from '../stats/loadActivityStatsByTime';
import UserStatsStore from '../../stores/UserStatsStore';
import UserProfileStore from '../../stores/UserProfileStore';


export default function loadUserStats(context, payload, done) {
    let username = context.getStore(UserProfileStore).username;
    let datePeriod = context.getStore(UserStatsStore).datePeriod;
    let activityType = context.getStore(UserStatsStore).activityType;


    log.info(context);
    async.parallel([
        (callback) => {
            context.executeAction(loadActivityStatsByTime, {datePeriod, username, activityType}, callback);
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
