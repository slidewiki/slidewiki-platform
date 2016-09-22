import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../../stores/UserProfileStore';

export default function saveTreeNode(context, payload, done) {
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;
        context.service.update('decktree.nodeTitle', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                context.dispatch('SAVE_TREE_NODE_FAILURE', err);
            } else {
                context.dispatch('SAVE_TREE_NODE_SUCCESS', payload);
                //update the URL
                let newURL = '/deck/' + payload.selector.id + '/' + payload.selector.stype + '/' + payload.selector.sid + '/' + payload.selector.spath;
                context.executeAction(navigateAction, {
                    url: newURL
                });
            }
            done();
        });
    }
}
