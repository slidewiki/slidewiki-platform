export default {
    name: 'activities',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'activities.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let activities = [
                {'id': 0, 'type': 'add', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), 'username': 'Ali K.', 'userID': 23, 'date': '1 Hour Ago', 'likesNo': 4},
                {'id': 1, 'type': 'edit', 'contentType': 'deck', 'contentID': 53 + parseInt(args.sid), 'username': 'Dara T.', 'userID': 13, 'date': 'Today', 'likesNo': 1},
                {'id': 2, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), 'username': 'Vuk M.', 'userID': 7, 'date': '45 Minutes Ago', 'likesNo': 2, 'translation': {'contentID':42, 'language':'Serbian'}},
                {'id': 3, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), 'username': 'Vuk M.', 'userID': 7, 'date': '30 Minutes Ago', 'likesNo': 2, 'translation': {'contentID':42, 'language':'Bosnian'}},
                {'id': 4, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), 'username': 'Vuk M.', 'userID': 7, 'date': '15 Minutes Ago', 'likesNo': 2, 'translation': {'contentID':42, 'language':'Croatian'}},
                {'id': 5, 'type': 'share', 'contentType': 'deck', 'contentID': 53 + parseInt(args.sid), 'username': 'Vuk M.', 'userID': 7, 'date': '7 Minutes Ago', 'likesNo': 10, 'shareInfo': {'postURI':'http://facebook.com', 'platform':'Facebook'}}
            ];
            callback(null, {activities: activities});
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
