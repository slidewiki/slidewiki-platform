import {shortTitle} from '../../configs/general';
import slideIdTypeError from '../error/slideIdTypeError';
import serviceUnavailable from '../error/serviceUnavailable';
import { AllowedPattern } from '../error/util/allowedPattern';
import showSlideEditPanel from '../deckpagelayout/showSlideEditPanel.js';
const log = require('../log/clog');

export default function loadSlideView(context, payload, done) {
    log.info(context);
    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }
    console.log('send to load');
    context.dispatch('LOAD_SLIDE_CONTENT_LOAD', {loadingIndicator: 'true'});
    //context.dispatch('LOAD_SLIDE_CONTENT_LOAD');
    //console.log('get content');

    context.service.read('slide.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.executeAction(hideSlideEditPanel,{}, () => {
                context.dispatch('LOAD_SLIDE_CONTENT_SUCCESS', res);
            });
        }
        let pageTitle = shortTitle + ' | Slide View | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
