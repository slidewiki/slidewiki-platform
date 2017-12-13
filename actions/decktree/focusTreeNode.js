const log = require('../log/clog');

export default function focusTreeNode(context, payload, done) {
    log.info(context);
    context.dispatch('FOCUS_TREE_NODE', payload);
    done();
}
