import { shortTitle } from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import resetSearchParams from './resetSearchParams';
import { isEmpty } from 'lodash';

export default function loadSearchResults(context, payload, done) {
    context.dispatch('UPDATE_PAGE_TITLE', {
        pageTitle: shortTitle + ' | Search'
    });

    if(isEmpty(payload.query)){
        context.executeAction(resetSearchParams, payload, done);
        return;
    }

    payload.query.sort = payload.query.sort || 'score';

    // start loading ans set search params
    context.dispatch('SHOW_LOADING');
    context.dispatch('SET_SEARCH_PARAMS', payload.query);

    // fetch results from search-service
    context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message});
            context.dispatch('LOAD_RESULTS_FAILURE', err);
        } else {
            context.dispatch('LOAD_RESULTS_SUCCESS', res);
        }

        done();
    });
}
