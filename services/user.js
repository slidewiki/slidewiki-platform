export default {
    name: 'user',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': parseInt(args.id), 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'page': params.page};

        //not used - data is already in the store
        if (resource === 'user.item'){
            let user = {};

            callback(null, {user: user});
        }
    },

    create: (req, resource, params, body, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'user.registration'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            callback(null, args);
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
