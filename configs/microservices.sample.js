const co = require('../common');

export default {
    Microservices: {
        'deck': {
            uri: 'http://deckservice.stable.slidewiki.org'
        },
        'discussion': {
            uri: 'http://discussionservice.stable.slidewiki.org'
        },
        'activities': {
            uri: 'http://activitiesservice.stable.slidewiki.org'
        },
        'notification': {
            uri: 'http://notificationservice.stable.slidewiki.org'
        },
        'user': {
            uri: 'http://userservice.stable.slidewiki.org'
        },
        'import': {
            uri: 'http://importservice.stable.slidewiki.org',
            protocol: 'http:',
            host: 'importservice.stable.slidewiki.org',
            path: '/importPPTX',
            port: 80
        },
        'search': {
            uri: 'http://searchservice.stable.slidewiki.org'
        },
        'image': {
            uri: 'http://imageservice.stable.slidewiki.org'
        },
        'file': {
            uri: 'http://fileservice.stable.slidewiki.org'
        },
        'pdf': {
            uri : 'http://pdfservice.stable.slidewiki.org'
        }
    }
};
