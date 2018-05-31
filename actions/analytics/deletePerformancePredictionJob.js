const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function deletePerformancePredictionJob(context, payload, done) {
    log.info(context, payload);

    context.service.delete('analytics.prediction', payload, {timeout: 60 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('DELETE_PERFORMANCE_PREDICTION_SUCCESS', payload);
        }
        done();
    });
}
