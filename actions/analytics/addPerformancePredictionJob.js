const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';
import executePerformancePredictionJob from './executePerformancePredictionJob';

export default function addPerformancePredictionJob(context, payload, done) {
    log.info(context, payload);
    //enrich data
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.create('analytics.predictionActivity', payload, {timeout: 60 * 1000}, {timeout: 600 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            payload.prediction.id = res.activity.id;
            context.dispatch('ADD_PERFORMANCE_PREDICTION_SUCCESS', payload);
            context.executeAction(executePerformancePredictionJob, payload, done);
        }
        done();
    });
}
