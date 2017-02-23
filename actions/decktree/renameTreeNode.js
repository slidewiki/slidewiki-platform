const log = require('../log/clog');

export default function renameTreeNode(context, payload, done) {
    log.info(context);
    context.dispatch('RENAME_TREE_NODE_SUCCESS', payload);
    done();
}
