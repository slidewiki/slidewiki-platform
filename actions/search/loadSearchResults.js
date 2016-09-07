import {shortTitle} from '../../configs/general';
import { searchSyntaxError, searchStringEmptyError } from '../loadErrors';

export default function loadSearchResults(context, payload, done) {
    if (!(payload.params.searchstring.startsWith('searchstring='))) {
        context.executeAction(searchSyntaxError, payload).catch((err) => {done(err);});
        return;
    }

    // searchstring parameter contains 'searchstring=' as prefix.
    if (!payload.params.searchstring.substr(13)) {
        context.executeAction(searchStringEmptyError, payload).catch((err) => {done(err);});
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
