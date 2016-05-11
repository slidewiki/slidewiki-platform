export default {
    name: 'similarcontent',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'sid': args.sid, 'stype': args.stype};
        if(resource === 'similarcontent.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let contents = [
                {'id': '16', 'title': 'item 1 related to ' + args.sid, 'author': 'soeren' , 'authorId':'2' , 'liked': '20', 'downloaded': '5'},
                {'id': '28', 'title': 'item 2 related to ' + args.sid, 'author': 'soeren', 'authorId':'2' , 'liked': '15', 'downloaded': '6'},
                {'id': '39', 'title': 'item 3 related to ' + args.sid, 'author': 'ali1k', 'authorId':'1' , 'liked': '10', 'downloaded': '4'}
            ];
            callback(null, {contents: contents, selector: selector});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
