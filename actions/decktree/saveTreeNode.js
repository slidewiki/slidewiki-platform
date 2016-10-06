import UserProfileStore from '../../stores/UserProfileStore';
import handleRevisionChangesAndNavigate from '../revisioning/handleRevisionChangesAndNavigate';

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
                let newSid;
                if (payload.selector.stype === 'slide') {
                    newSid = res._id + '-' + res.revisions[0].id;
                } else {
                    if (res.changeset != null) {
                        let newRevisions = res.changeset.new_revisions;
                        newSid = newRevisions[newRevisions.length - 1];
                    } else {
                        newSid = payload.selector.sid;
                    }
                }
                let selector = {
                    id: payload.selector.id,
                    stype: payload.selector.stype,
                    sid: newSid,
                    spath: payload.selector.spath
                };
                context.executeAction(handleRevisionChangesAndNavigate, {
                    selector: selector,
                    changeset: res.changeset
                });
            }
            done();
        });
    }
}
