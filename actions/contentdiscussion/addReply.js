import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function addReply(context, payload, done) {
    log.info(context, payload);
    context.service.create('discussion.reply', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('ADD_REPLY_FAILURE', err);
        } else {
            context.dispatch('ADD_REPLY_SUCCESS', res);
        }

        done();
    });
}
