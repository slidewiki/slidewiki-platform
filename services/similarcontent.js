const log = require('../configs/log').log;

export default {
    name: 'similarcontent',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'sid': args.sid, 'stype': args.stype};
        if(resource === 'similarcontent.list'){
            /*********connect to microservices*************/
            //todo
            //likes: https://activitiesservice.experimental.slidewiki.org/activities/deck/3951?metaonly=true&activity_type=react&all_revisions=true
            //download: https://activitiesservice.experimental.slidewiki.org/activities/deck/3951?metaonly=true&activity_type=download&all_revisions=true
            //user https://userservice.experimental.slidewiki.org/user/16

            /*********received data from microservices*************/
            let contents = [
                {'deckId': '718', 'title': 'final test' , 'firstSlideId': '6398', 'author': 'txwkx' , 'authorId':'47' , 'date':'27/01/2017' ,'liked': '0', 'downloaded': '0'},
                {'deckId': '617', 'title': 'Usability 3', 'firstSlideId': '5144','author': 'abijames1', 'authorId':'6' , 'date':'20/01/2017' ,'liked': '1', 'downloaded': '0'},
                {'deckId': '2249', 'title': 'Usability', 'firstSlideId': '14738','author': 'dpaun', 'authorId':'16' , 'date':'22/08/2017' ,'liked': '0', 'downloaded': '0'}
            ];
            callback(null, {contents: contents, selector: selector});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
