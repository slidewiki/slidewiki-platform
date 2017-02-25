import { shortTitle } from '../../configs/general';
import deckContentTypeError from '../error/deckContentTypeError';
import slideIdTypeError from '../error/slideIdTypeError';
import { AllowedPattern } from '../error/util/allowedPattern';

export default function loadTags(context, payload, done) {
    console.log(params);
    const {params: {sid, id, stype}} = payload;
    const serviceAddr = 'tags.' + stype;
    const objId = stype === 'slide'? sid: id;
    const params = {
        id: objId
    };

    context.service.read(serviceAddr, params, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_TAGS_FAILURE', err);
        } else {
            context.dispatch('LOAD_TAGS_SUCCESS', {tags: res, selector: payload.selector, owner: ''});
            context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'tags'});
            let pageTitle = shortTitle + ' | Tags | ' + payload.params.stype + ' | ' + payload.params.sid;
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: pageTitle
            });
        }
        done();
    });
}
