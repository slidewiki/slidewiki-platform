import { shortTitle } from '../../configs/general';
import deckContentTypeError from '../error/deckContentTypeError';
import slideIdTypeError from '../error/slideIdTypeError';
import { AllowedPattern } from '../error/util/allowedPattern';
const log = require('../log/clog');

export default function loadTags(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'tags'});
}
