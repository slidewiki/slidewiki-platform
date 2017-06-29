import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function loadCommentsCount(context, payload, done) {
    log.info(context);
    context.service.read('discussion.count', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_AMOUNT_OF_COMMENTS_FAILURE', err);
        } else {
            context.dispatch('LOAD_AMOUNT_OF_COMMENTS_SUCCESS', res);
        }

        done();
    });
}
