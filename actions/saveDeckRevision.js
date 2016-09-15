import UserProfileStore from '../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';
import striptags from 'striptags';

//extracts the id of the immediate parent deck from the path string
function findImmediateParentId(selector) {
    //no parent
    if (!selector.sid || selector.sid === selector.id) {
        return null;
    }
    let arr = selector.spath.split(';');
    //root deck is parent
    if (arr.length <= 1) {
        return selector.id;
    } else {
        arr.splice(-1, 1);
        return arr[arr.length - 1].split(':')[0];
    }
}

export default function saveDeckRevision(context, payload, done) {
    //enrich with user id
    let userid = context.getStore(UserProfileStore).userid;

    if (userid == null || userid === '') {
        context.executeAction(navigateAction, {
            url: '/'
        });
    } else {
        //enrich with user id
        payload.userid = userid;
        //enrich with root deck id if deck to be revised is not uppermost deck
        let immediateParent = findImmediateParentId(payload.selector);
        payload.root_deck = immediateParent;
        context.service.update('deck.updateWithRevision', payload, null, {timeout: 30 * 1000}, (err, res) => {
            if (err) {
                context.dispatch('SAVE_DECK_REVISION_FAILURE', err);
            } else {
                context.dispatch('SAVE_DECK_REVISION_SUCCESS', res);
                context.dispatch('UPDATE_TREE_NODE_SUCCESS', {
                    selector: payload.selector,
                    nodeSpec: {title: striptags(payload.title)}
                });
                //update the URL: redirect to view after edit
                let newURL = '/deck/' + payload.selector.id + '/' + payload.selector.stype + '/' + payload.selector.sid + '/' + payload.selector.spath;
                context.executeAction(navigateAction, {
                    url: newURL
                });
            }
            done();
        });
    }
}


