export default {
    name: 'activities',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        if(resource === 'activities.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let now = Date.now();
            function timeFromNow(now, hours, mins) {
                return now - 60000*mins - 3600000*hours;
            }
            let activities = [
                {'id': 0, 'type': 'add', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), 'username': 'Ali K.', 'userID': 23, 'date': timeFromNow(now,2,0), 'likesNo': 4},
                {'id': 1, 'type': 'edit', 'contentType': 'deck', 'contentID': 53 + parseInt(args.sid), 'username': 'Dara T.', 'userID': 13, 'date': timeFromNow(now,1,0), 'likesNo': 1},
                {'id': 2, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,45), 'likesNo': 2, 'translation': {'contentID':42, 'language':'Serbian'}},
                {'id': 3, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,30), 'likesNo': 2, 'translation': {'contentID':42, 'language':'Bosnian'}},
                {'id': 4, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,15), 'likesNo': 2, 'translation': {'contentID':42, 'language':'Croatian'}},
                {'id': 5, 'type': 'share', 'contentType': 'deck', 'contentID': 53 + parseInt(args.sid), 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,7), 'likesNo': 10, 'shareInfo': {'postURI':'http://facebook.com', 'platform':'Facebook'}},
                {'id': 6, 'type': 'comment', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,6), 'likesNo': 3, commentID: 42, commentText: 'Awesome!'},
                {'id': 7, 'type': 'reply', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), 'username': 'Ali K.', 'userID': 23, 'date': timeFromNow(now,0,5), 'likesNo': 3, replyID: 43, replyText: 'Indeed', commentID: 42},
                {id: 8, type: 'use', contentType: 'slide', contentID: 67 + parseInt(args.sid), username: 'Vuk M.', userID: 7, date: timeFromNow(now,0,4), likesNo: 2, targetDeckID: 53 + parseInt(args.sid)}
            ];
            callback(null, {activities: activities, selector: selector});
        }
    },
    update: (req, resource, params, body, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'activities.like'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            callback(null, {id: args.id});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
