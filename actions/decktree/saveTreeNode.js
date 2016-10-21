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
                let newSid = payload.selector.sid, newPath = payload.selector.spath;
                if (payload.selector.stype === 'slide') {
                    newSid = res._id + '-' + res.revisions[0].id;
                    if (payload.selector.spath !== '') {
                        let pathArr = payload.selector.spath.split(';');
                        let lastPath = pathArr[pathArr.length - 1];
                        let lastPathPosition = lastPath.split(':')[1];
                        pathArr[pathArr.length - 1] = newSid + ':' + lastPathPosition;
                        newPath = pathArr.join(';');
                    }
                }
                let selector = {
                    id: payload.selector.id,
                    stype: payload.selector.stype,
                    sid: newSid,
                    spath: newPath
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
