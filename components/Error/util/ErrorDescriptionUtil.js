export default {
    ErrorsList: {
        DECK_ID_TYPE_ERROR: {
            statusCode: 400,
            statusText: 'Bad Request',
            type: 'Type Error',
            description: 'Inappropriate data is added for deck id.',
            actionRequired: 'Please enter a numeric value as deck id.'
        },
        SLIDE_ID_TYPE_ERROR: {
            statusCode: 400,
            statusText: 'Bad Request',
            type: 'Type Error',
            description: 'Inappropriate data is added for slide id.',
            actionRequired: 'Please enter a correct slide id. Slide id can have alpha-numeric values seperated by a dash.'
        },
        DECK_CONTENT_TYPE_ERROR: {
            statusCode: 400,
            statusText: 'Bad Request',
            type: 'Type Error',
            description: 'Inappropriate data is added for deck content type.',
            actionRequired: 'Please enter correct deck content type. The deck content type can be a slide, a deck or a question.'
        },
        DECK_CONTENT_PATH_ERROR: {
            statusCode: 400,
            statusText: 'Bad Request',
            type: 'Type Error',
            description: 'Inappropriate data is added to content path in deck tree.',
            actionRequired: 'Please enter a correct content path. The content path in deck tree is separated by semi-colon and colon for its position, e.g. 67:3;45:1;45:4'
        },
        DECK_MODE_ERROR: {
            statusCode: 400,
            statusText: 'Bad Request',
            type: 'Reference Error',
            description: 'Inappropriate data is added for the deck interaction mode.',
            actionRequired: 'Please enter the correct interaction mode. A deck can have either view or edit as the interaction mode.'
        },
        LOGIN_INCORRECT_ERROR: {
            statusCode: 403,
            statusText: 'Forbidden',
            type: 'Forbidden Error', // We can not classify as one of the standard javascript errors types as the error is occuring outside the javascript.
            description: 'Sorry, access denied. Accessing a resource without appropriate login credentials.',
            actionRequired: 'Please provide appropriate login credentials.'
        },
        METHOD_NOT_FOUND_ERROR: {
            statusCode: 405,
            statusText: 'Method Not Found',
            type: 'Method Not Found', // We can not classify as one of the standard javascript errors types as the error is occuring outside the javascript.
            description: 'The HTTP request method is inappropriate for this request.',
            actionRequired: 'Please use correct HTTP request method and try again.'
        },
        GATEWAY_TIMEOUT_ERROR: {
            statusCode: 504,
            statusText: 'Gateway Timeout',
            type: 'Gateway Timeout Error', // We can not classify as one of the standard javascript errors types as the error is occuring outside the javascript.
            description: 'The server did not receive a timely response from upstream server.',
            actionRequired: 'Please try again after some time.'
        },
        RESOURCE_NOT_FOUND_ERROR: {
            statusCode: 404,
            statusText: 'Not Found',
            type: 'Content Not Found',
            description: 'The entered URL does not exist.',
            actionRequired: 'Please enter a correct URL.'
        },
        SEARCH_QUERY_EMPTY_ERROR: {
            statusCode: 422,
            statusText: 'Unprocessable Entity',
            type: 'Semantic Error',
            description: 'Search query not available.',
            actionRequired: 'Please provide a search query and try again.'
        },
        SEARCH_SYNTAX_ERROR: {
            statusCode: 400,
            statusText: 'Bad Request',
            type: 'Syntax Error',
            description: 'Inappropriate syntax is used for search parameter.',
            actionRequired: 'Please enter correct syntax of the search parameter.'
        }
    }
};
