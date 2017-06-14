import {navigateAction} from 'fluxible-router';
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');

export default function createRevision(context, payload, done) {
    log.info(context);
    payload.jwt = context.getStore(UserProfileStore).jwt;
    context.service.create('history.revision', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('CREATE_REVISION_SUCCESS', res);
            //navigate to the new revision
            context.executeAction(navigateAction, {
                url: '/deck/' + res._id + '-' + res.revisions[0].id
            });
        }
        done();
    });
}
