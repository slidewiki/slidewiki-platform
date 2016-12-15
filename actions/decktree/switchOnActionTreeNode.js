const clog = require('../log/clog');

export default function switchOnActionTreeNode(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('SWITCH_ON_ACTION_TREE_NODE_SUCCESS', payload);
    done();
}
