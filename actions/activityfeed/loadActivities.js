import { shortTitle } from '../../configs/general';
import deckContentTypeError from '../error/deckContentTypeError';
import slideIdTypeError  from '../error/slideIdTypeError';
import serviceUnavailable from '../error/serviceUnavailable';
import { AllowedPattern } from '../error/util/allowedPattern';
import { logger, breadcrumb} from '../../configs/log';

export default function loadActivities(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    if(!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
        context.executeAction(deckContentTypeError, payload, done);
        return;
    }

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    context.service.read('activities.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            logger.error({reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_ACTIVITIES_FAILURE', err);
        } else {
            context.dispatch('LOAD_ACTIVITIES_SUCCESS', res);
            context.dispatch('UPDATE_ACTIVITY_TYPE_SUCCESS', {activityType: 'all'});
        }
        let pageTitle = shortTitle + ' | Activities | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
