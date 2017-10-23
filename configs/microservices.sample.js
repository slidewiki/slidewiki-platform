const co = require('../common');

/*
This microservice configuration points the platform towards
using the experimental server of the SlideWiki development
team.

IMPORTANT NOTE:
==============
If you are creating a new service or adding new operations (e.g. read/update/delete etc)
then please remember to add following lines of code in your service module:

STEP 1: Initialize logger in your service. This you can do immediately after importing
other function. You can do that as follow:

const log = require('../configs/log').log;
------------------------------------------------------------------------------------------------------------------------------
STEP 2: Call the logger immediately after defining service operation. For example, if you are
        creating "read" operation then add the following:

read: (req, resource, params, config, callback) => {
    req.reqId = req.reqId ? req.reqId : -1;
    log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
    // remaining code follows
}
------------------------------------------------------------------------------------------------------------------------------
STEP 3: Verify that in STEP 2, you have correct operation mentioned. If you see in the STEP 2 above, we have a
        key:value pair in log.info(...) mentioned as: log.info(..., Operation: 'read', ...) . Ensure that your defined operation
        and the operation mentioned in the log.info(...) are same.
------------------------------------------------------------------------------------------------------------------------------

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
        'file': {
            uri: 'https://fileservice.experimental.slidewiki.org'
        },
        'pdf': {
            uri : 'https://pdfservice.experimental.slidewiki.org'
        },
        'tag': {
            uri : 'https://tagservice.experimental.slidewiki.org'
        },
        'translation': {
            uri: 'https://translationservice.experimental.slidewiki.org'
        },
        'questions': {
            uri: 'https://questionservice.experimental.slidewiki.org'
        }
    }
};
