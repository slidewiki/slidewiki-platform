import UserProfileStore from '../../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';


export default function forkDeck(context, payload, done) {
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
                context.dispatch('FORK_DECK_FAILURE', err);
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