const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function addPerformancePredictionJob(context, payload, done) {
    log.info(context, payload);
    context.service.create('analytics.prediction', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            context.dispatch('ADD_PERFORMANCE_PREDICTION_FAILED');
        } else {
            context.dispatch('ADD_PERFORMANCE_PREDICTION_SUCCESS', res);
        }
        done();
    });
}
