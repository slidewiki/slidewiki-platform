import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';


export default function loadUserStatsByTag(context, payload, done) {
    log.info(context);
    let username = context.getStore(UserProfileStore).username;

    context.service.read('stats.userStatsByTag', {username}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_USER_STATS_BY_TAG', {statsByTag: res});
        }
        done();
    });
}
