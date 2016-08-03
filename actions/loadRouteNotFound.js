import async from 'async';
import {shortTitle} from '../configs/general';
import ErrorStore from '../stores/ErrorStore';
import {ErrorsList} from '../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function loadRouteNotFound(context, payload, done) {
    let error = fumble.http.notFound();
    context.dispatch('RESOURCE_NOT_FOUND_ERROR', ErrorsList.RESOURCE_NOT_FOUND_ERROR);
    throw error;
}
