import {shortTitle} from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';
const clog = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadSearchResults(context, payload, done) {
    // if query is given, call service to fetch results
    if(payload.params.queryparams){
        context.dispatch('SHOW_LOADING', payload);
        context.dispatch('SET_PARAMS', payload);

        context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                clog.error(context, payload, {filepath: __filename, err: err});
                context.executeAction(serviceUnavailable, payload, done);
                //context.dispatch('LOAD_RESULTS_FAILURE', err); // not implemented in store
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
