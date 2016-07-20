export default {
    ErrorsList: {
        'DECK_ID_TYPE_ERROR': {
            statusCode: 400,
            statusText: 'Bad Request',
            type: 'Type Error',
            description: 'Inappropriate data is added for deck id.',
            actionRequired: 'Please enter a numeric value as deck id.'
        },
        'DECK_CONTENT_ID_TYPE_ERROR': {
            statusCode: 400,
            statusText: 'Bad Request',
            type: 'Type Error',
            description: 'Inappropriate data is added for deck content id.',
            actionRequired: 'Please enter an alpha numeric value as deck content id.'
        },
        'DECK_CONTENT_TYPE_ERROR': {
            statusCode: 400,
            statusText: 'Bad Request',
            type: 'Type Error',
            description: 'Inappropriate data is added for deck content type.',
            actionRequired: 'Please enter correct deck content type. The deck content can be of type either slide, deck or question.'
        },
        'DECK_CONTENT_PATH_ERROR': {
            statusCode: 400,
            statusText: 'Bad Request',
            type: 'Type Error',
            description: 'Inappropriate data is added for path of the content in deck tree.',
            actionRequired: 'Please enter a correct content path. The path of the content in deck tree is separated by semi-colon and colon for its position, e.g. 67:3;45:1;45:4'
        },

        'RESOURCE_NOT_FOUND_ERROR': {
            statusCode: 404,
            statusText: 'Not Found',
            type: 'Content Not Found',
            description: 'The entered URL does not exist.',
            actionRequired: 'Pleaes enter a correct URL.'
        }
    }
};
