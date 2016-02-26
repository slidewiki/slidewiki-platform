export default {
    name: 'history',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        if(resource === 'history.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let history = [
                {'id': 122, 'Date': 'Yesterday'},
                {'id': 345, 'Date': '3 days ago'}
            ];
            callback(null, {history: history, selector: selector});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
