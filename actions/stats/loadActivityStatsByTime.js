import UserProfileStore from '../../stores/UserProfileStore';

const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import fetchUser from '../user/userprofile/fetchUser';
import loadCollectionDetails from '../collections/loadCollectionDetails';

export default function loadUserStats(context, payload, done) {
    log.info(context);

    context.service.read('stats.userActivitiesByTime', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_ACTIVITY_STATS_BY_TIME', {activitiesByTime: res});
        }
        done();
    });
}
