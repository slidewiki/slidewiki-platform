const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

// loads deck groups assigned by the current user to a deck
export default function loadDeckUserCollections(context, payload, done) {
    log.info(context);

    // enrich payload with user id
    if(payload.params){
        payload.params.userId = context.getStore(UserProfileStore).userid;
        payload.params.jwt = context.getStore(UserProfileStore).jwt;
    } else {
        payload.userId = context.getStore(UserProfileStore).userid;
        payload.jwt = context.getStore(UserProfileStore).jwt;
    }
    
    context.dispatch('UPDATE_COLLECTIONS_LOADING', true);

    // first get user groups that the user is member of 
    context.service.read('usergroup.member', payload, {timeout: 20 * 1000}, (err, usergroups) => {
        if(err){
            log.error(context, {filepath: __filename});
            done();
        } else {
            
            // then get deck collection options
            payload.usergroups = usergroups;
            context.service.read('deckgroups.forDeck', payload, {timeout: 20 * 1000}, (err, res) => {
                if (err) {
                    log.error(context, {filepath: __filename});
                    context.dispatch('LOAD_COLLECTIONS_FAILURE', err);
                } else {
                    context.dispatch('LOAD_COLLECTIONS_SUCCESS', res);
                }
                
                context.dispatch('UPDATE_COLLECTIONS_LOADING', false);

                done();
            });
        }
    }); 
}
