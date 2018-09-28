const log = require('../log/clog');
// import serviceUnavailable from '../error/serviceUnavailable';
import addActivity from '../activityfeed/addActivity';

export default function deletePerformancePredictionJob(context, payload, done) {
    log.info(context, payload);
    let activity = {
        activity_type: 'prediction',
        user_id: String(payload.userId),
        content_id: String(payload.deckId),
        content_name: payload.deckTitle,
        content_kind: 'deck',
        prediction_info: {
            prediction_activity_type: 'delete',
            related_prediction_activity_id: payload.activityId
        }
    };
    context.executeAction(addActivity, {activity: activity});
    context.dispatch('DELETE_PERFORMANCE_PREDICTION_SUCCESS', payload);
    done();
    // context.service.delete('analytics.prediction', payload, {timeout: 60 * 1000}, (err, res) => {
    //     if (err) {
    //         log.error(context, {filepath: __filename});
    //         context.executeAction(serviceUnavailable, payload, done);
    //     } else {
    //         context.dispatch('DELETE_PERFORMANCE_PREDICTION_SUCCESS', payload);
    //     }
    //     done();
    // });
}
