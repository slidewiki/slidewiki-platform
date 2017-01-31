const co = require('../common');

/* 
This microservice configuration points the platform towards
using the experimental server of the SlideWiki development
team.
*/


export default {
    Microservices: {
        'deck': {
            uri: 'http://deckservice.experimental.slidewiki.org'
        },
        'discussion': {
            uri: 'http://discussionservice.experimental.slidewiki.org'
        },
        'activities': {
            uri: 'http://activitiesservice.experimental.slidewiki.org'
        },
        'notification': {
            uri: 'http://notificationservice.experimental.slidewiki.org'
        },
        'user': {
            uri: 'http://userservice.experimental.slidewiki.org'
        },
        'import': {
            uri: 'http://importservice.experimental.slidewiki.org',
            protocol: 'http:',
            host: 'importservice.experimental.slidewiki.org',
            path: '/importPPTX',
            port: 80
        },
        'search': {
            uri: 'http://searchservice.experimental.slidewiki.org'
        },
        'image': {
            uri: 'http://imageservice.experimental.slidewiki.org'
        },
        'file': {
            uri: 'http://fileservice.experimental.slidewiki.org'
        },
        'pdf': {
            uri : 'http://pdfservice.experimental.slidewiki.org'
        }
    }
};
