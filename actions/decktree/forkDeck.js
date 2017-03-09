import UserProfileStore from '../../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function forkDeck(context, payload, done) {
    log.info(context);
    //enrich with user id
    let userid = context.getStore(UserProfileStore).userid;
    if (userid == null || userid === '') {
        context.executeAction(navigateAction, {
            url: '/'
        });
    } else {
        //enrich with user id
        payload.userid = userid;

        context.service.update('deck.fork', payload, null, {timeout: 30 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename, err: err});
                context.executeAction(serviceUnavailable, payload, done);

                if (err.statusCode === 401) {
                    context.dispatch('FORK_DECK_FAILURE', err);
                    //TODO detect if not authorized - special message
                }
            } else {
                context.dispatch('FORK_DECK_SUCCESS', res);
                let newSid = res._id + '-' + res.revisions[0].id;
                let newURL = '/deck/' + newSid;
                //update the URL
                context.executeAction(navigateAction, {
                    url: newURL
                });
            }
            done();
        }
        );
    }
}
