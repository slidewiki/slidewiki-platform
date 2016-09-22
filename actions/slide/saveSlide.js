import UserProfileStore from '../../stores/UserProfileStore';
import {shortTitle} from '../../configs/general';
import {navigateAction} from 'fluxible-router';
import striptags from 'striptags';

//extracts the id of the slide's immediate parent deck from the path string
function findImmediateParentId(selector) {
    let arr = selector.spath.split(';');
    //root deck is parent
    if (arr.length <= 1) {
        return selector.id;
    } else {
        arr.splice(-1, 1);
        return arr[arr.length - 1].split(':')[0];
    }
}

export default function saveSlide(context, payload, done) {
    //enrich with user id
    let userid = context.getStore(UserProfileStore).userid;
    //enrich with root deck id if deck to be revised is not uppermost deck
    let immediateParent = findImmediateParentId(payload.selector);
    payload.root_deck = immediateParent;

    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;
        context.service.update('slide.content', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                context.dispatch('SAVE_SLIDE_EDIT_FAILURE', err);
            } else {
                context.dispatch('SAVE_SLIDE_EDIT_SUCCESS', res);
                //TODO: retrieve the new revision number from deck-service and send it to decktree
                context.dispatch('UPDATE_TREE_NODE_SUCCESS', {
                    selector: payload.selector,
                    nodeSpec: {title: striptags(payload.title), id: res.slide.id, path: res.slide.path}
                });
                //update the URL: redirect to view after edit
                let newURL = '/deck/' + res.selector.id + '/' + res.selector.stype + '/' + res.slide.id + '/' + res.slide.path;
                context.executeAction(navigateAction, {
                    url: newURL
                });
            }
            //let pageTitle = shortTitle + ' | Slide Edit | ' + payload.params.sid;
            let pageTitle = shortTitle + ' | Slide Edit | ';
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: pageTitle
            });
            done();
        });
    }
}
