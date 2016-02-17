export default {
    name: 'datasource',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if(resource === 'datasource.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let args = params.params? params.params : params;
            let datasources = [
                {'title': 'Source 1 #' + args.sid, 'id': 231},
                {'title': 'Source 2 #' + args.sid, 'id': 243},
                {'title': 'Source 3 #' + args.sid, 'id': 31},
            ];
            callback(null, {datasources: datasources});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
