import serviceUnavailable from '../error/serviceUnavailable';
import {navigateAction} from 'fluxible-router';
const log = require('../log/clog');

export default function getNextReviewableUser(context, payload, done) {
    log.info(context);

    context.service.read('userreview.nextreviewable', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('NEXT_REVIEWABLE_USER_SUCCESS', res);
            if (res.user) {
                context.executeAction(navigateAction, {
                    url: '/Sfn87Pfew9Af09aM/user/' + res.user.username
                });
            }
        }

        done();
    });
}
