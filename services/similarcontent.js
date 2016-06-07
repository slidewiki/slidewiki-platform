export default {
    name: 'similarcontent',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector = {'sid': args.sid, 'stype': args.stype};
        let payload = {
            args : args,
            selector : selector
        };

        if(resource === 'similarcontent.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let contents = [
                {'id': '16', 'title': 'title deck related to ' + args.sid, 'author': 'soeren' , 'authorId':'2' , 'date':'15/05/2016' ,'liked': '20', 'downloaded': '5'},
                {'id': '28', 'title': 'title deck related to ' + args.sid, 'author': 'soeren', 'authorId':'2' , 'date':'18/04/2016' ,'liked': '15', 'downloaded': '6'},
                {'id': '39', 'title': 'title deck related to ' + args.sid, 'author': 'ali1k', 'authorId':'1' , 'date':'03/05/2016' ,'liked': '10', 'downloaded': '4'}
            ];
            callback(null, {contents: contents, selector: selector});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
