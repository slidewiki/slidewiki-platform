const clog = require('../log/clog');

export default function renameTreeNode(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('RENAME_TREE_NODE_SUCCESS', payload);
    done();
}
