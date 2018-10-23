import {shortTitle} from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';

export default function loadFacetWithPrefix(context, payload, done) {

    context.service.read('searchresults.prefixFacet', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_FACETS_FAILURE', err);
        } else {
            context.dispatch('LOAD_FACETS', res);
        }

        done();
    });
}
