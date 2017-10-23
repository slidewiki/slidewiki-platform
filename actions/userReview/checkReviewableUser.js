import serviceUnavailable from '../error/serviceUnavailable';
import UserReviewStore from '../../stores/UserReviewStore';
import {navigateAction} from 'fluxible-router';

const log = require('../log/clog');

export default function checkReviewableUser(context, payload, done) {
    log.info(context);
    if (payload.params.username !== context.getStore(UserReviewStore).username) {
        context.executeAction(navigateAction, {
            url: '/Sfn87Pfew9Af09aM'
        });
    }
    done();
}
