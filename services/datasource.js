export default {
    name: 'datasource',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if(resource === 'datasource.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let datasources = [
                {'title': 'Source 1', 'id': 231},
                {'title': 'Source 2', 'id': 243},
                {'title': 'Source 3', 'id': 31},
            ];
            callback(null, {datasources: datasources});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
