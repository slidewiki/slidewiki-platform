import {shortTitle} from '../../configs/general';

export default function loadSearchResults(context, payload, done) {

    // if query is given, call service to fetch results
    if(payload.params.queryparams){
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
        context.dispatch('NO_QUERY_PARAMS', payload);
        done();
    }
}
