const co = require('../common');

export default {
    Microservices: {
        'deck': {
            uri: (!co.isEmpty(process.env.SERVICE_URL_DECK)) ? process.env.SERVICE_URL_DECK : 'http://deckservice.experimental.slidewiki.org'
        },
        'discussion': {
            uri: (!co.isEmpty(process.env.SERVICE_URL_DISCUSSION)) ? process.env.SERVICE_URL_DISCUSSION : 'http://discussionservice.experimental.slidewiki.org'
        },
        'activities': {
            uri: (!co.isEmpty(process.env.SERVICE_URL_ACTIVITIES)) ? process.env.SERVICE_URL_ACTIVITIES : 'http://activitiesservice.experimental.slidewiki.org'
        },
        'notification': {
            uri: (!co.isEmpty(process.env.SERVICE_URL_NOTIFICATION)) ? process.env.SERVICE_URL_NOTIFICATION : 'http://notificationservice.experimental.slidewiki.org'
        },
        'user': {
            uri: (!co.isEmpty(process.env.SERVICE_URL_USER)) ? process.env.SERVICE_URL_USER : 'http://userservice.experimental.slidewiki.org'
        },
        'import': {
            uri: (!co.isEmpty(process.env.SERVICE_URL_IMPORT)) ? process.env.SERVICE_URL_IMPORT : 'http://importservice.experimental.slidewiki.org',
            protocol: 'http:',
            host: 'importservice.manfredfris.ch',
            host: (!co.isEmpty(process.env.SERVICE_VAR_IMPORT_HOST)) ? process.env.SERVICE_VAR_IMPORT_HOST : 'importservice.experimental.slidewiki.org',
            path: '/importPPTX',
            port: 80
        },
        'search': {
            uri: (!co.isEmpty(process.env.SERVICE_URL_SEARCH)) ? process.env.SERVICE_URL_SEARCH : 'http://searchservice.experimental.slidewiki.org'
        },
        'image': {
            uri: (!co.isEmpty(process.env.SERVICE_URL_IMAGE)) ? process.env.SERVICE_URL_IMAGE : 'http://imageservice.experimental.slidewiki.org'
        },
        'file': {
            uri: (!co.isEmpty(process.env.SERVICE_URL_FILE)) ? process.env.SERVICE_URL_FILE : 'http://fileservice.experimental.slidewiki.org'
        }
    }
};
