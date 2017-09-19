import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
const log = require('../log/clog');

export default function spamDetected(context, payload, done) {
    log.error(context,  'SPAM detected');
    ErrorsList.SPAM_DETECTED_ERROR.statusCode = 403;
    ErrorsList.SPAM_DETECTED_ERROR.statusText = payload.message;
    context.dispatch('SPAM_DETECTED_ERROR', ErrorsList.SPAM_DETECTED_ERROR);
    done(error);
}
