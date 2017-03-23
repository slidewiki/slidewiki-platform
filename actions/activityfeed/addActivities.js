import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function addActivity(context, payload, done) {
    log.info(context);
    context.service.create('activities.newarray', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('ADD_ACTIVITIES_SUCCESS', res);
        }

        done();
    });
}
