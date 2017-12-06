const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

// loads deck collections created by the current user or his user groups
export default function loadUserCollections(context, payload, done) {
    log.info(context);
    
    // request deck collections for the loggedin user
    if(context.getStore(UserProfileStore).userid === context.getStore(UserProfileStore).user.id){
        
        // enrich payload with user id and authToken
        payload.userId = context.getStore(UserProfileStore).userid;
        payload.jwt = context.getStore(UserProfileStore).jwt;

        // first get user groups that the user is member of 
        context.service.read('usergroup.member', payload, {timeout: 20 * 1000}, (err, usergroups) => {
            if(err){
                log.error(context, {filepath: __filename});
                done();
            } else {

                // then get deck collection corresponding to the loggedin user and his user groups
                payload.usergroups = usergroups;
                context.service.read('deckgroups.forUser', payload, {timeout: 20 * 1000}, (err, res) => {
                    if (err) {
                        log.error(context, {filepath: __filename});
                        context.dispatch('LOAD_USER_COLLECTIONS_FAILURE', err);
                    } else {
                        context.dispatch('LOAD_USER_COLLECTIONS_SUCCESS', res);
                    }

                    done();
                });
            }
        }); 

    // request deck collections for a user that is not the logged in one
    } else {

        payload.userId = context.getStore(UserProfileStore).user.id;
        
        // just get the deck collections for this user
        context.service.read('deckgroups.forUser', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.dispatch('LOAD_USER_COLLECTIONS_FAILURE', err);
            } else {
                context.dispatch('LOAD_USER_COLLECTIONS_SUCCESS', res);
            }

            done();
        });
    }    
}
