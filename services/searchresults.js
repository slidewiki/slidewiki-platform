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
            let result = 'Searched for string: ' + args.searchstring + ' , result: RDF is a standard model for data';
            //let result = 'Searched for string: "RDF" , result: RDF is a standard model for data';
            let searchresults = [
                {'id': '1', 'type':'slide', 'sid': '12', 'description': 'Searched for string: ' + args.searchstring + ' , result: RDF is a standard model for data', 'stitle':'Introuction'},
                {'id': '2', 'type':'deck', 'did': '23', 'description':result},
                {'id': '3', 'type':'deck_revision', 'did': '26', 'title':'What Is RDF by rewriting it from'},
                {'id': '4', 'type':'deck_revision', 'did': '31', 'comment':'Introduction RDF is one of'},
                {'id': '5', 'type':'answer', 'aid': '87', 'explanation':'Introduction to RDF including'}
            ];

            let entities = [{'id': '1', 'description':'slide'}, {'id': '2', 'description':'deck'}, {'id': '3', 'description':'answer'}];
            let languages = [{'id': '1', 'description':'EN'}, {'id': '2', 'description':'ES'}];

            callback(null, {results: searchresults, entities: entities, languages:languages});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
