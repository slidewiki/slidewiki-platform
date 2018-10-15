import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';

export default function loadFacetsFilter(context, payload, done) {
    context.dispatch('FILTER_FACETS', payload);
    done();
}
