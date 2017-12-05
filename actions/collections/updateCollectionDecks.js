const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

export default function updateCollectionDecks(context, payload, done) {
    log.info(context);

    // enrich payload with jwt
    payload.userId = context.getStore(UserProfileStore).userid;
    payload.jwt = context.getStore(UserProfileStore).jwt;

    // first get user groups that the user is member of 
    context.service.read('usergroup.member', payload, {timeout: 20 * 1000}, (err, usergroups) => {
        if(err){
            console.log(err);
            log.error(context, {filepath: __filename});
        } else {

            payload.usergroups = usergroups;
            context.service.update('deckgroups.decks', payload, {timeout: 20 * 1000}, (err, res) => {
                if (err) {
                    console.log(err);
                    log.error(context, {filepath: __filename});
                    context.dispatch('UPDATE_DECKS_OF_DECK_GROUP_ERROR', err);
                }

                done();
            });
        }
    });
}
