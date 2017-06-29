import {shortTitle} from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import resetSearchParams from './resetSearchParams';

export default function loadSearchResults(context, payload, done) {

    if(!payload.params.queryparams){
        context.executeAction(resetSearchParams, payload, done);
        return;
    }

    // start loading ans set search params
    context.dispatch('SHOW_LOADING', payload);
    context.dispatch('SET_PARAMS', payload);

    // fetch results from search-service
    context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_RESULTS_FAILURE', err); // not implemented in store
        } else {
            context.dispatch('LOAD_RESULTS_SUCCESS', res);
        }

        done();
    });
}
