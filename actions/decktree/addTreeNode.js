import UserProfileStore from '../../stores/UserProfileStore';
const clog = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function addTreeNode(context, payload, done) {
    clog.info(context, payload);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;
        context.service.create('decktree.node', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                clog.error(context, payload, {filepath: __filename, err: err});
                context.executeAction(serviceUnavailable, payload, done);
                //context.dispatch('ADD_TREE_NODE_FAILURE', err);
            } else {
                context.dispatch('ADD_TREE_NODE_SUCCESS', res);
            }
            done(null, res);
        });
    }
}
