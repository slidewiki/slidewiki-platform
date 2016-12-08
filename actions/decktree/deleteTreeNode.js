import UserProfileStore from '../../stores/UserProfileStore';
import { logger, breadcrumb} from '../../configs/log';
import serviceUnavailable from '../error/serviceUnavailable';

export default function deleteTreeNode(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;
        context.service.delete('decktree.node', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                logger.error({reqId: payload.navigate.reqId, err: err});
                context.executeAction(serviceUnavailable, payload, done);
                //context.dispatch('DELETE_TREE_NODE_FAILURE', err);
            } else {
                context.dispatch('DELETE_TREE_NODE_SUCCESS', payload);
            }
            done(null, res);
        });
    }
}
