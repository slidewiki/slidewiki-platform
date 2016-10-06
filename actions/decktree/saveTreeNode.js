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
                let selector = {
                    id: payload.selector.id,
                    stype: payload.selector.stype,
                    sid: payload.selector.stype === 'slide' ? res._id + '-' + res.revisions[0].id : payload.selector.sid,
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
