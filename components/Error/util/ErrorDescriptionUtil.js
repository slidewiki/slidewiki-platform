export default {
    ErrorsList: {
        DECK_ID_TYPE_ERROR: {
            type: 'Type Error',
            description: 'Inappropriate data is added for deck id.',
            actionRequired: 'Please enter a numeric value as deck id.'
        },
        SLIDE_ID_TYPE_ERROR: {
            type: 'Type Error',
            description: 'Inappropriate data is added for slide id.',
            actionRequired: 'Please enter a correct slide id. Slide id can have alpha-numeric values seperated by a dash.'
        },
        DECK_CONTENT_TYPE_ERROR: {
            type: 'Type Error',
            description: 'Inappropriate data is added for deck content type.',
            actionRequired: 'Please enter correct deck content type. The deck content type can be a slide, a deck or a question.'
        },
        DECK_CONTENT_PATH_ERROR: {
            type: 'Type Error',
            description: 'Inappropriate data is added to content path in deck tree.',
            actionRequired: 'Please enter a correct content path. The content path in deck tree is separated by semi-colon and colon for its position, e.g. 67:3;45:1;45:4'
        },
        DECK_MODE_ERROR: {
            type: 'Reference Error',
            description: 'Inappropriate data is added for the deck interaction mode.',
            actionRequired: 'Please enter the correct interaction mode. A deck can have either view or edit as the interaction mode.'
        },
        LOGIN_INCORRECT_ERROR: {
            type: 'Forbidden Error', // We can not classify as one of the standard javascript errors types as the error is occuring outside the javascript.
            description: 'Sorry, access denied. Accessing a resource without appropriate login credentials.',
            actionRequired: 'Please provide appropriate login credentials.'
        },
        METHOD_NOT_ALLOWED_ERROR: {
            type: 'Method Not Allowed', // We can not classify as one of the standard javascript errors types as the error is occuring outside the javascript.
            description: 'The HTTP request method is inappropriate for this request.',
            actionRequired: 'Please use correct HTTP request method and try again.'
        },
        GATEWAY_TIMEOUT_ERROR: {
            type: 'Gateway Timeout Error', // We can not classify as one of the standard javascript errors types as the error is occuring outside the javascript.
            description: 'The server did not receive a timely response from upstream server.',
            actionRequired: 'Please try again after some time.'
        },
        NOT_FOUND_ERROR: {
            type: 'Resource Not Found',
            description: 'The requested resource does not exist.',
            actionRequired: 'Please request another resource and try again.'
        },
        SEARCH_QUERY_EMPTY_ERROR: {
            type: 'Semantic Error',
            description: 'Search query not available.',
            actionRequired: 'Please provide a search query and try again.'
        },
        SEARCH_SYNTAX_ERROR: {
            type: 'Syntax Error',
            description: 'Inappropriate syntax is used for search parameter.',
            actionRequired: 'Please enter correct syntax of the search parameter.'
        },
        SERVICE_UNAVAILABLE: {
            type: 'Service Unavailable',
            description: 'The server is currently unable to handle the request due to one of the following reasons: temporary overload, maintenance or temporary connection error.',
            actionRequired: 'Please try after some time.'
        },
        TOO_MANY_REQUESTS_ERROR: {
            type: 'Too Many Requests',
            description: 'Too many requests are sent in a given amount of time.',
            actionRequired: 'Please try again after some time.'
        }
    }
};
