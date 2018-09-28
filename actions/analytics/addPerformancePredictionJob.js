const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';
import addActivity from '../activityfeed/addActivity';

export default function addPerformancePredictionJob(context, payload, done) {
    let activity = {
        activity_type: 'prediction',
        user_id: String(payload.prediction.userId),
        content_id: String(payload.prediction.deckId),
        content_name: payload.prediction.deckTitle,
        content_kind: 'deck',
        prediction_info: {
            prediction_activity_type: 'start'
        }
    };
    context.executeAction(addActivity, {activity: activity});

    log.info(context, payload);
    //enrich data
    payload.jwt = context.getStore(UserProfileStore).jwt;
    context.dispatch('ADD_PERFORMANCE_PREDICTION_SUCCESS', payload);

    context.service.create('analytics.prediction', payload, {timeout: 60 * 1000}, {timeout: 600 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_USER_PERFORMANCE_PREDICTIONS_SUCCESS', res);//list of all prediction jobs received
        }
        done();
    });
}
