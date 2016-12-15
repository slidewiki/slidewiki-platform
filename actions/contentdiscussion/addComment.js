import serviceUnavailable from '../error/serviceUnavailable';
const clog = require('../log/clog');

export default function addComment(context, payload, done) {
    clog.info(context, payload);

    context.service.create('discussion.comment', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            clog.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('ADD_COMMENT_FAILURE', err);
        } else {
            context.dispatch('ADD_COMMENT_SUCCESS', res);
        }

        done();
    });
}
