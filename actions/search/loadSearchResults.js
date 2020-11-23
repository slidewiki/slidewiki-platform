import { shortTitle } from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import { isEmpty, isArray } from 'lodash';

export default function loadSearchResults(context, payload, done) {
    payload.query.sort = payload.query.sort || 'score';

    // convert facet filters to arrays
    if (payload.query.language && !isArray(payload.query.language)) {
        payload.query.language = [payload.query.language];
    }

    if (payload.query.user && !isArray(payload.query.user)) {
        payload.query.user = [payload.query.user];
    }

    if (payload.query.tag && !isArray(payload.query.tag)) {
        payload.query.tag = [payload.query.tag];
    }

    if (payload.query.educationLevel && !isArray(payload.query.educationLevel)) {
        payload.query.educationLevel = [payload.query.educationLevel];
    }

    if (payload.query.topics && !isArray(payload.query.topics)) {
        payload.query.topics = [payload.query.topics];
    }

    if (payload.query.facet_exclude && !isArray(payload.query.facet_exclude)) {
        payload.query.facet_exclude = [payload.query.facet_exclude];
    }

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
