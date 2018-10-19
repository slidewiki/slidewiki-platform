import {shortTitle} from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';

export default function loadMoreResults(context, payload, done) {


    context.dispatch('SHOW_LOAD_MORE_LOADING', payload);

    context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_RESULTS_FAILURE', err);
        } else {
            context.dispatch('LOAD_MORE_RESULTS_SUCCESS', res);
        }

        done();
    });
}
