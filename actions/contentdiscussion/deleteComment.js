import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function deleteComment(context, payload, done) {
    log.info(context);
    context.service.delete('discussion.item', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('DELETE_COMMENT_SUCCESS', res);
        }

        done();
    });
}
