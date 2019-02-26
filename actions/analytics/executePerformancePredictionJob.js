const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function executePerformancePredictionJob(context, payload, done) {
    log.info(context, payload);
    
    context.service.create('analytics.prediction', payload, {timeout: 60 * 1000}, {timeout: 600 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('PERFORMANCE_PREDICTION_COMPLETED', res);
        }
        done();
    });
}
