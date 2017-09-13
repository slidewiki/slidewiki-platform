import UserProfileStore from '../../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';
import serviceUnavailable from '../error/serviceUnavailable';
import addActivity from '../activityfeed/addActivity';
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
        let selector = payload.selector;
        context.service.update('deck.fork', {deckId: selector.id, jwt: context.getStore(UserProfileStore).jwt}, null, {timeout: 30 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
                if (err.statusCode === 401) {
                    context.dispatch('FORK_DECK_FAILURE', err);
                }
            } else {
                context.dispatch('FORK_DECK_SUCCESS', res);
                let newURL, newId = res.root_deck;
                // by default after forking a deck, navigate to the same position that was shown before
                // unless the navigateToRoot parameter is set
                newURL = '/deck/' + newId;
                if (!payload.navigateToRoot){
                    let newSid = selector.stype === 'deck' ? res.id_map[selector.sid] : selector.sid;
                    if (newSid != null){
                        let pathArr = selector.spath.split(';');
                        let newSpath = pathArr.map((node, index) => {
                            if (index === pathArr.length - 1 && selector.stype === 'slide'){
                                return node;
                            }
                            let splitNode = node.split(':');
                            splitNode[0] = res.id_map[splitNode[0]] || splitNode[0];
                            return splitNode.join(':');
                        }).join(';');
                        newURL = '/deck/' + newId + '/' + selector.stype + '/' + newSid;
                        if (newSpath !== ''){
                            newURL += '/' + newSpath;
                        }
                        if (payload.mode === 'edit'){
                            newURL += '/edit';
                        }
                    }
                }
                //update the URL
                context.executeAction(navigateAction, {
                    url: newURL
                });

                //create new activity
                let activity = {
                    activity_type: 'fork',
                    user_id: String(userid),
                    content_id: selector.id,
                    content_kind: 'deck'
                };
                context.executeAction(addActivity, {activity: activity});
            }
            done();
        }
        );
    }
}
