export default {
    name: 'usage',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'usage.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let usage = [
                {'id': 122, 'Date': 'Yesterday'},
                {'id': 345, 'Date': '3 days ago'}
            ];
            callback(null, {usage: usage});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
