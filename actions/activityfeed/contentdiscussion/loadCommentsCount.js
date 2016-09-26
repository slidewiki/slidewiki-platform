import {serviceUnavailable} from '../../loadErrors';

export default function loadCommentsCount(context, payload, done) {
    context.service.read('discussion.count', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
          context.executeAction(serviceUnavailable, payload).catch((error) => {done(error);});
          return;
          // context.dispatch('LOAD_AMOUNT_OF_COMMENTS_FAILURE', err);
        } else {
            context.dispatch('LOAD_AMOUNT_OF_COMMENTS_SUCCESS', res);
        }

        done();
    });
}
