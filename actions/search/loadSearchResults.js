import {shortTitle} from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';

export default function loadSearchResults(context, payload, done) {


    // if query is given, call service to fetch results
    if(payload.params.queryparams){

        context.dispatch('SHOW_LOADING', payload);
        context.dispatch('SET_PARAMS', payload);

        context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                context.dispatch('LOAD_RESULTS_FAILURE', err);
            } else {
                context.dispatch('LOAD_RESULTS_SUCCESS', res);
            }

            done();
        });
    }
    else{
        context.dispatch('RESET_PARAMS', payload);
        done();
    }
}
