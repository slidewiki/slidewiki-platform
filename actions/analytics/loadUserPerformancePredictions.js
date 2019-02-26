import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');
import UserProfileStore from '../../stores/UserProfileStore';

export default function loadUserPerformancePredictions(context, payload, done) {
    log.info(context);

    // start loading
    context.dispatch('SHOW_PERFORMANCE_PREDICTIONS_LOADING', payload);
    payload.uid = context.getStore(UserProfileStore).userid;
    context.service.read('analytics.predictionslist', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('LOAD_USER_NOTIFICATIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_USER_PERFORMANCE_PREDICTIONS_SUCCESS', res);
        }

        done();
    });
}
