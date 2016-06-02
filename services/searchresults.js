export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        // let selector= {'stype': args.stype};
        if(resource === 'searchresults.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/

        	//
            let searchresults = [
                {'id': '1', 'type':'slide', 'sid': '12', 'description':'RDF is a standard model for data', 'stitle':'Introuction'},
                {'id': '2', 'type':'deck', 'did': '23', 'description':'RDF was designed to provide'},
                {'id': '3', 'type':'deck_revision', 'did': '26', 'title':'What Is RDF by rewriting it from'},
                {'id': '4', 'type':'deck_revision', 'did': '31', 'comment':'Introduction RDF is one of'},
                {'id': '5', 'type':'answer', 'aid': '87', 'explanation':'Introduction to RDF including'}
            ];

            callback(null, {searchresults: searchresults});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
