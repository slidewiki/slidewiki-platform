const co = require('../common');

/*
This microservice configuration points the platform towards
using the experimental server of the SlideWiki development
team.
*/


export default {
    Microservices: {
        'deck': {
            uri: 'https://deckservice.experimental.slidewiki.org'
        },
        'discussion': {
            uri: 'https://discussionservice.experimental.slidewiki.org'
        },
        'activities': {
            uri: 'https://activitiesservice.experimental.slidewiki.org'
        },
        'notification': {
            uri: 'https://notificationservice.experimental.slidewiki.org'
        },
        'user': {
            uri: 'https://userservice.experimental.slidewiki.org'
        },
        'import': {
            uri: 'https://importservice.experimental.slidewiki.org',
            protocol: 'https:',
            host: 'importservice.experimental.slidewiki.org',
            path: '/importPPTX',
            port: 443
        },
        'search': {
            uri: 'https://searchservice.experimental.slidewiki.org'
        },
        'image': {
            uri: 'https://imageservice.experimental.slidewiki.org'
        },
        'file': {
            uri: 'https://fileservice.experimental.slidewiki.org'
        },
        'pdf': {
            uri : 'https://pdfservice.experimental.slidewiki.org'
        }
    }
};
