export default {
    name: 'translation',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if(resource === 'translation.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            callback(null, {translations: []});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
