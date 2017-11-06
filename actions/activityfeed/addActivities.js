import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function addActivities(context, payload, done) {
    log.info(context);

    //enrich with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.create('activities.newarray', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('ADD_ACTIVITIES_SUCCESS', res);
        }

        done();
    });
}
