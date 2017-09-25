const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

export default function updateDataSources(context, payload, done) {
    log.info(context);

    // enrich with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('datasource.array', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('UPDATE_DATASOURCES_FAILURE', err);
        } else {
            context.dispatch('UPDATE_DATASOURCES_SUCCESS', res);
        }

        done();
    });
}
