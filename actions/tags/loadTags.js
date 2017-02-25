import { shortTitle } from '../../configs/general';
import deckContentTypeError from '../error/deckContentTypeError';
import slideIdTypeError from '../error/slideIdTypeError';
import { AllowedPattern } from '../error/util/allowedPattern';

export default function loadTags(context, payload, done) {
    const {params: {sid, id}} = payload;
    const serviceAddr = sid? 'tags.slide': 'tags.deck';
    const objId = sid? sid: id;

    context.service.read(serviceAddr, objId, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            console.log(err);
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
