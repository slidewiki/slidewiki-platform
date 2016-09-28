import {serviceUnavailable} from '../../loadErrors';

export default function addReply(context, payload, done) {
    context.service.create('discussion.reply', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
          context.executeAction(serviceUnavailable, payload).catch((error) => {done(error);});
          return;
          // context.dispatch('ADD_REPLY_FAILURE', err);
        } else {
            context.dispatch('ADD_REPLY_SUCCESS', res);
        }

        done();
    });
}
