import async from 'async';
import ErrorStore from '../stores/ErrorStore';
import {ErrorsList} from '../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export function deckIdTypeError(context, payload) {
    const error = fumble.http.badRequest();
    context.dispatch('DECK_ERROR', ErrorsList.DECK_ID_TYPE_ERROR);
    throw error;
}

export function deckContentTypeError(context, payload) {
    const error = fumble.http.badRequest();
    context.dispatch('DECK_ERROR', ErrorsList.DECK_CONTENT_TYPE_ERROR);
    throw error;
}

export function slideIdTypeError(context, payload) {
    const error = fumble.http.badRequest();
    context.dispatch('SLIDE_ERROR', ErrorsList.SLIDE_ID_TYPE_ERROR);
    throw error;
}

export function deckContentPathError(context, payload) {
    const error = fumble.http.badRequest();
    context.dispatch('DECK_ERROR', ErrorsList.DECK_CONTENT_PATH_ERROR);
    throw error;
}

export function deckModeError(context, payload) {
    const error = fumble.http.badRequest();
    context.dispatch('DECK_ERROR', ErrorsList.DECK_MODE_ERROR);
    throw error;
}

export function routeNotFoundError(context, payload) {
    const error = fumble.http.notFound();
    context.dispatch('RESOURCE_NOT_FOUND_ERROR', ErrorsList.RESOURCE_NOT_FOUND_ERROR);
    throw error;
}

export function searchSyntaxError(context, payload) {
    const error = fumble.http.badRequest();
    context.dispatch('SEARCH_ERROR', ErrorsList.SEARCH_SYNTAX_ERROR);
    throw error;
}

export function searchStringEmptyError(context, payload) {
    const error = fumble.http.create(422, 'Unprocessable Entity');
    context.dispatch('SEARCH_ERROR', ErrorsList.SEARCH_QUERY_EMPTY_ERROR);
    throw error;
}

export function timeoutError(context, payload) {
    const error = fumble.http.badRequest();
    context.dispatch('GATEWAY_TIMEOUT_ERROR', ErrorsList.SEARCH_SYNTAX_ERROR);
    throw error;
}

export { deckIdTypeError, deckContentTypeError, deckContentPathError, deckModeError,
         slideIdTypeError, routeNotFoundError, searchSyntaxError, searchStringEmptyError };
