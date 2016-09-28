import {shortTitle} from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';

export default function loadSearchResults(context, payload, done) {
    if (!(payload.params.searchstring.startsWith('searchstring='))) {
        context.executeAction(searchSyntaxError, payload, done);
        return;
    }

    // searchstring parameter contains 'searchstring=' as prefix.
    if (!payload.params.searchstring.substr(13)) {
        context.executeAction(searchStringEmptyError, payload, done);
        return;
    }

    context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_RESULTS_FAILURE', err);
        } else {
            context.dispatch('LOAD_RESULTS_SUCCESS', res);
        }

        done();
    });
}
