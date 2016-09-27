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
                let newSid = res._id + '-' + res.revisions[0].id;
                let newPath = '', newURL;
                //root deck case
                if (payload.selector.id === payload.selector.sid) {
                    newURL = '/deck/' + newSid;
                } else {
                    if (payload.selector.spath !== '') {
                        let pathArr = payload.selector.spath.split(';');
                        let lastPath = pathArr[pathArr.length - 1];
                        let lastPathPosition = lastPath.split(':')[1];
                        pathArr[pathArr.length - 1] = newSid + ':' + lastPathPosition;
                        newPath = pathArr.join(';');
                    }
                    newURL = '/deck/' + payload.selector.id + '/' + payload.selector.stype + '/' + newSid + '/' + newPath;
                    // if deck edited is subdeck update the corresponding tree node. Not necessary in the root deck case,
                    // since with navigate action the deck tree will be refetched
                    context.dispatch('UPDATE_TREE_NODE_SUCCESS', {
                        selector: payload.selector,
                        nodeSpec: {title: striptags(res.revisions[0].title), id: newSid, path: newPath}
                    });
                }
                //update the URL: redirect to view after edit
                context.executeAction(navigateAction, {
                    url: newURL
                });
            }
            done();
        });
    }
}