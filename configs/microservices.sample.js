export default {
    Microservices: {
        'deck': {
            uri: 'http://deckservice.manfredfris.ch'
        },
        'discussion': {
            uri: 'http://discussionservice.manfredfris.ch'
        },
        'activities': {
            uri: 'http://activitiesservice.manfredfris.ch'
        },
        'notification': {
            uri: 'http://notificationservice.manfredfris.ch'
        },
        'user': {
            uri: 'http://userservice.manfredfris.ch'
        },
        'import': {
            uri: 'http://importservice.manfredfris.ch',
            protocol: 'http:',
            host: 'importservice.manfredfris.ch',
            path: '/importPPTX',
            port: 80
        }
    }
};
