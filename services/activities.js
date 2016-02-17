export default {
    name: 'activities',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if(resource === 'activities.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let args = params.params? params.params : params;
            let activities = [
                {'type': 'add', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), 'username': 'Ali K.', 'userID': 23, 'date': '1 Hour Ago', 'likesNo': 4},
                {'type': 'edit', 'contentType': 'deck', 'contentID': 53 + parseInt(args.sid), 'username': 'Dara T.', 'userID': 13, 'date': 'Today', 'likesNo': 1}
            ];
            callback(null, {activities: activities});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
