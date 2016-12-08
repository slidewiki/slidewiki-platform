import { shortTitle } from '../configs/general';
import slideIdTypeError from './error/slideIdTypeError';
import { AllowedPattern } from './error/util/allowedPattern';
import { logger, breadcrumb} from '../configs/log';
import serviceUnavailable from './error/serviceUnavailable';

export default function loadDeckEdit(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    context.service.read('deck.properties', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            logger.error({reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_DECK_PROPS_FAILURE', err);
        } else {
            context.dispatch('LOAD_DECK_PROPS_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Deck Edit | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
