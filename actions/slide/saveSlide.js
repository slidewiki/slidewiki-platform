import UserProfileStore from '../../stores/UserProfileStore';
import RevisioningStore from '../../stores/RevisioningStore';
import {shortTitle} from '../../configs/general';
import {navigateAction} from 'fluxible-router';
import striptags from 'striptags';
import TreeUtil from '../../components/Deck/TreePanel/util/TreeUtil';

export default function saveSlide(context, payload, done) {
    //enrich with user id
    let userid = context.getStore(UserProfileStore).userid;
    const revStoreStatus = context.getStore(RevisioningStore).getState();
    //TODO: extend this
    //for now it always refreshes the page when a new deck rev needs to be created
    if(revStoreStatus.needs_revision){
        //call hand change action and
        //refresh the page
    }
    //enrich with root deck id if deck to be revised is not uppermost deck
    let parent = TreeUtil.getParentId(payload.selector);
    payload.root_deck = parent;

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
