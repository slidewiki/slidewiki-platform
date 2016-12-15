const clog = require('../log/clog');

export default function toggleTreeNode(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('TOGGLE_TREE_NODE_SUCCESS', payload);
    done();
}
