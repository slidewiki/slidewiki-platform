const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function addPerformancePredictionJob(context, payload, done) {
    log.info(context, payload);
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
