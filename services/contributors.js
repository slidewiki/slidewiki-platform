export default {
    name: 'contributors',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if(resource === 'contributors.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let args = params.params? params.params : params;
            let sampleData = [
                {'id': '1', 'username': 'ali1k' + args.sid, 'organization': 'VUA'},
                {'id': '2', 'username': 'soeren' + args.sid, 'organization': 'Fraunhofer'},
                {'id': '3', 'username': 'darya' + args.sid, 'organization': 'Bonn'}
            ];
            callback(null, {contributors: sampleData});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
