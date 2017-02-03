import { shortTitle } from '../../configs/general';
import deckContentTypeError from '../error/deckContentTypeError';
import slideIdTypeError from '../error/slideIdTypeError';
import { AllowedPattern } from '../error/util/allowedPattern';

export default function loadTags(context, payload, done) {
    // if(!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
    //     context.executeAction(deckContentTypeError, payload).catch((err) => {done(err);});
    //     return;
    // }
    //
    // if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
    //     context.executeAction(slideIdTypeError, payload, done);
    //     return;
    // }
    //
    // context.service.read('datasource.list', payload, {timeout: 20 * 1000}, (err, res) => {
    //     if (err) {
    //         context.dispatch('LOAD_DATASOURCES_FAILURE', err);
    //     } else {
    //         context.dispatch('LOAD_DATASOURCES_SUCCESS', res);
    //         context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'datasource'});
    //     }
    //     let pageTitle = shortTitle + ' | Data Sources | ' + payload.params.stype + ' | ' + payload.params.sid;
    //     context.dispatch('UPDATE_PAGE_TITLE', {
    //         pageTitle: pageTitle
    //     });
    //     done();
    // });
    let tags = ['Test1', 'Test2'];
    context.dispatch('LOAD_TAGS_SUCCESS', {tags: tags, selector: payload.selector, owner: ''});
    context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'tags'});
    let pageTitle = shortTitle + ' | Tags | ' + payload.params.stype + ' | ' + payload.params.sid;
    context.dispatch('UPDATE_PAGE_TITLE', {
        pageTitle: pageTitle
    });
    done();
}
