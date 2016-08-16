import async from 'async';
import ErrorStore from '../stores/ErrorStore';
import { ErrorsList } from '../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export function deckIdTypeError(context, payload) {
    const error = fumble.http.badRequest();
    ErrorsList.DECK_ID_TYPE_ERROR.statusCode = error.statusCode;
    ErrorsList.DECK_ID_TYPE_ERROR.statusText = error.message;
    context.dispatch('TOO_MANY_REQUESTS_ERROR', ErrorsList.DECK_ID_TYPE_ERROR);
    throw error;
}

export function deckContentTypeError(context, payload, done) {
    const error = fumble.http.badRequest();
    ErrorsList.DECK_CONTENT_TYPE_ERROR.statusCode = error.statusCode;
    ErrorsList.DECK_CONTENT_TYPE_ERROR.statusText = error.message;
    context.dispatch('DECK_CONTENT_TYPE_ERROR', ErrorsList.DECK_CONTENT_TYPE_ERROR);
    throw error;
}

export function slideIdTypeError(context, payload, done) {
    const error = fumble.http.badRequest();
    ErrorsList.SLIDE_ID_TYPE_ERROR.statusCode = error.statusCode;
    ErrorsList.SLIDE_ID_TYPE_ERROR.statusText = error.message;
    context.dispatch('SLIDE_ID_TYPE_ERROR', ErrorsList.SLIDE_ID_TYPE_ERROR);
    throw error;
}

export function deckContentPathError(context, payload) {
    const error = fumble.http.badRequest();
    ErrorsList.DECK_CONTENT_PATH_ERROR.statusCode = error.statusCode;
    ErrorsList.DECK_CONTENT_PATH_ERROR.statusText = error.message;
    context.dispatch('DECK_CONTENT_PATH_ERROR', ErrorsList.DECK_CONTENT_PATH_ERROR);
    throw error;
}

export function deckModeError(context, payload) {
    const error = fumble.http.badRequest();
    ErrorsList.DECK_MODE_ERROR.statusCode = error.statusCode;
    ErrorsList.DECK_MODE_ERROR.statusText = error.message;
    context.dispatch('DECK_MODE_ERROR', ErrorsList.DECK_MODE_ERROR);
    throw error;
}

export function gatewayTimeoutError(context, payload) {
    const error = fumble.http.badRequest();
    ErrorsList.GATEWAY_TIMEOUT_ERROR.statusCode = error.statusCode;
    ErrorsList.GATEWAY_TIMEOUT_ERROR.statusText = error.message;
    context.dispatch('GATEWAY_TIMEOUT_ERROR', ErrorsList.GATEWAY_TIMEOUT_ERROR);
    throw error;
}

export function loginIncorrectError(context, payload) {
    const error = fumble.http.forbidden();
    ErrorsList.LOGIN_INCORRECT_ERROR.statusCode = error.statusCode;
    ErrorsList.LOGIN_INCORRECT_ERROR.statusText = error.message;
    context.dispatch('LOGIN_INCORRECT_ERROR', ErrorList.LOGIN_INCORRECT_ERROR);
}

export function methodNotAllowedError(context, payload) {
    const error = fumble.http.methodNotAllowed();
    ErrorsList.METHOD_NOT_ALLOWED_ERROR.statusCode = error.statusCode;
    ErrorsList.METHOD_NOT_ALLOWED_ERROR.statusText = error.message;
    context.dispatch('METHOD_NOT_ALLOWED_ERROR', ErrorsList.METHOD_NOT_ALLOWED_ERROR);
    throw error;
}

export function notFoundError(context, payload) {
    const error = fumble.http.notFound();
    ErrorsList.NOT_FOUND_ERROR.statusCode = error.statusCode;
    ErrorsList.NOT_FOUND_ERROR.statusText = error.message;
    context.dispatch('NOT_FOUND_ERROR', ErrorsList.NOT_FOUND_ERROR);
    throw error;
}

export function searchSyntaxError(context, payload) {
    const error = fumble.http.badRequest();
    ErrorsList.SEARCH_SYNTAX_ERROR.statusCode = error.statusCode;
    ErrorsList.SEARCH_SYNTAX_ERROR.statusText = error.message;
    context.dispatch('SEARCH_SYNTAX_ERROR', ErrorsList.SEARCH_SYNTAX_ERROR);
    throw error;
}

export function searchStringEmptyError(context, payload) {
    const error = fumble.http.create(422, 'Unprocessable Entity');
    ErrorsList.SEARCH_QUERY_EMPTY_ERROR.statusCode = error.statusCode;
    ErrorsList.SEARCH_QUERY_EMPTY_ERROR.statusText = error.message;
    context.dispatch('SEARCH_QUERY_EMPTY_ERROR', ErrorsList.SEARCH_QUERY_EMPTY_ERROR);
    throw error;
}

export function serviceUnavailable(context, payload) {
    const error = fumble.http.serviceUnavailable();
    ErrorsList.SERVICE_UNAVAILABLE.statusCode = error.statusCode;
    ErrorsList.SERVICE_UNAVAILABLE.statusText = error.message;
    context.dispatch('SERVICE_UNAVAILABLE', ErrorsList.SERVICE_UNAVAILABLE);
    throw error;
}

export function tooManyRequestsError(context, payload) {
    const error = fumble.http.tooManyRequests();
    ErrorsList.TOO_MANY_REQUESTS_ERROR.statusCode = error.statusCode;
    ErrorsList.TOO_MANY_REQUESTS_ERROR.statusText = error.message;
    context.dispatch('TOO_MANY_REQUESTS_ERROR', ErrorsList.TOO_MANY_REQUESTS_ERROR);
    throw error;
}


export { deckIdTypeError, deckContentTypeError, deckContentPathError, deckModeError,
         slideIdTypeError, notFoundError, searchSyntaxError, searchStringEmptyError,
         methodNotAllowedError, tooManyRequestsError };
