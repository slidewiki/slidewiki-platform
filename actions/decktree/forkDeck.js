import UserProfileStore from '../../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';
const clog = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function forkDeck(context, payload, done) {
    clog.info(context, payload);
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
                clog.error(context, payload, {filepath: __filename, err: err});
                context.executeAction(serviceUnavailable, payload, done);
                //context.dispatch('FORK_DECK_FAILURE', err);
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
