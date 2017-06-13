import deckContentTypeError from '../error/deckContentTypeError';
import slideIdTypeError from '../error/slideIdTypeError';
import { AllowedPattern } from '../error/util/allowedPattern';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function addQuestion(context, payload, done) {
    log.info(context);
    context.service.create('questions.add', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('ADD_QUESTION_SUCCESS', res);
            console.log(res);
        }
        done();
    });
}
