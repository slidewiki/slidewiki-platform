import {shortTitle} from '../../configs/general';
import {ErrorsList} from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function loadSearchResults(context, payload, done) {
    if (!(payload.params.searchstring.startsWith('searchstring='))) {
        let error = fumble.http.badRequest();
        context.dispatch('SEARCH_ERROR', ErrorsList.SEARCH_SYNTAX_ERROR);
        throw error;
    }

    // searchstring parameter contains 'searchstring=' as prefix.
    if (!payload.params.searchstring.substr(13)) {
        let error = fumble.http.create(422, 'Unprocessable Entity');
        context.dispatch('SEARCH_ERROR', ErrorsList.SEARCH_QUERY_EMPTY_ERROR);
        throw error;
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
