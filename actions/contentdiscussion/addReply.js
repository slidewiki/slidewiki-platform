import serviceUnavailable from '../error/serviceUnavailable';

export default function addReply(context, payload, done) {
    context.service.create('discussion.reply', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            console.log('From addReply:', err);
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('ADD_REPLY_FAILURE', err);
        } else {
            context.dispatch('ADD_REPLY_SUCCESS', res);
        }

        done();
    });
}
