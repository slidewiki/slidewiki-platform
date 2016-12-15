import serviceUnavailable from '../error/serviceUnavailable';
const clog = require('../log/clog');

export default function loadCommentsCount(context, payload, done) {
    clog.info(context, payload);
    context.service.read('discussion.count', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            clog.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_AMOUNT_OF_COMMENTS_FAILURE', err);
        } else {
            context.dispatch('LOAD_AMOUNT_OF_COMMENTS_SUCCESS', res);
        }

        done();
    });
}
