const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

// loads deck groups created by the current user
export default function loadUserCollections(context, payload, done) {
    log.info(context);

    // enrich payload with user id
    payload.userId = context.getStore(UserProfileStore).userid;
    payload.jwt = context.getStore(UserProfileStore).jwt;

    // first get user groups that the user is member of 
    context.service.read('usergroup.member', payload, {timeout: 20 * 1000}, (err, usergroups) => {
        if(err){
            log.error(context, {filepath: __filename});
        } else {

            // then get deck collection options
            payload.usergroups = usergroups;
            context.service.read('deckgroups.suggest', payload, {timeout: 20 * 1000}, (err, res) => {
                if (err) {
                    log.error(context, {filepath: __filename});
                    context.dispatch('LOAD_USER_COLLECTIONS_FAILURE', err);
                } else {
                    context.dispatch('LOAD_USER_COLLECTIONS_SUCCESS', res);
                }

                done();
            });
        }
        done();
    });
}
