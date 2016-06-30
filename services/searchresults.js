export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        // let selector= {'stype': args.stype};

        let entity='';
        let searchlang='';
        let deckid='';
        let userid='';

        if(args.entity !== undefined){
            entity = args.entity;
        }
        if(args.searchlang !== undefined){
            searchlang = args.searchlang;
        }
        if(args.deckid !== undefined){
            deckid = args.deckid;
        }
        if(args.userid !== undefined){
            userid = args.userid;
        }

        if(resource === 'searchresults.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
        	//
            let result = 'Searched for string: ' + args.searchstring + ' , result: RDF is a standard model for data';
            //let result = 'Searched for string: "RDF" , result: RDF is a standard model for data';
            let searchresults = [
                {'id': '1', 'type':'slide', 'did': '24', 'sid': '12', 'uid':'23', 'description': 'RDF is a standard model for data', 'stitle':'Introuction', 'lang':'EN'},
                {'id': '2', 'type':'deck', 'did': '23', 'uid':'24', 'description':'Everything about RDF is already said', 'lang':'EN'},
                {'id': '3', 'type':'deck_revision', 'did': '23', 'uid':'25', 'title':'What Is RDF by rewriting it from', 'lang':'EN'},
                {'id': '4', 'type':'deck_revision', 'did': '31', 'uid':'26', 'comment':'Introduction RDF is one of', 'lang':'ES'},
                {'id': '5', 'type':'answer', 'did': '', 'aid': '87', 'uid':'23', 'explanation':'Introduction to RDF including', 'lang':'GR'}
            ];

            let entities = [{'id': '1', 'description':'slide'}, {'id': '2', 'description':'deck'}, {'id': '3', 'description':'answer'}];
            let languages = [{'id': '1', 'description':'EN'}, {'id': '2', 'description':'ES'}];



            callback(null, {results: searchresults, entities: entities, languages:languages,
                            searchstring:args.searchstring, entity:entity, searchlang:searchlang,
                            deckid:deckid, userid:userid
                           });
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
