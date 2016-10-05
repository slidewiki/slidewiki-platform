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
                let selector = {
                    id: payload.selector.id,
                    stype: payload.selector.stype,
                    sid: res._id + '-' + res.revisions[0].id,
                    spath: payload.selector.spath
                };
                let changeSet = res.changeset;
                if (changeSet != null) {
                    let pathArr = selector.spath.split(';');
                    let j = 0;
                    if (changeSet.new_revisions[0].root_changed != null) {
                        j = 1;
                        selector.id = changeSet.new_revisions[0].root_changed;
                    }
                    for (let i = 0; i < pathArr.length; i++) {
                        let pathNodeId = pathArr[i].split(':')[0].split('-')[0];
                        if (j < changeSet.new_revisions.length && pathNodeId === changeSet.new_revisions[j].split('-')[0]) {
                            pathArr[i] = pathNodeId + '-' + changeSet.new_revisions[j].split('-')[1] + ':' + pathArr[i].split(':')[1];
                            j++;
                        }
                    }
                    selector.spath = pathArr.join(';');
                }

                //update the URL
                let newURL = '/deck/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath;
                context.executeAction(navigateAction, {
                    url: newURL,
                    runFetchTree: changeSet != null
                });
            }
            done();
        });
    }
}
