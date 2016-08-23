export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;

        //Initialize the variables for the SOLR query
        let q = '';
        let fq = '';
        let solrResponse = '';

        // init parameter variables
        let searchstring = '';
        let entity = '';
        let lang = '';
        let group = '';
        let fields = '';
        let user = '';
        let tags = '';
        // let revisions = '';

        //Get search parameters
        let searchparams = args.queryparams.split('&');
        console.log('service calledw with ' + searchparams );

        for(let i = 0; i < searchparams.length; i++){

            if(searchparams[i].substring(0, searchparams[i].indexOf('=')) === 'q'){
                searchstring = searchparams[i].substring(searchparams[i].indexOf('=')+1);
            }

            if(searchparams[i].substring(0, searchparams[i].indexOf('=')) === 'entity'){
                entity = searchparams[i].substring(searchparams[i].indexOf('=')).substring(1);
            }

            if(searchparams[i].substring(0, searchparams[i].indexOf('=')) === 'lang'){
                lang = searchparams[i].substring(searchparams[i].indexOf('=')).substring(1);
            }

            if(searchparams[i].substring(0, searchparams[i].indexOf('=')) === 'group'){
                group = searchparams[i].substring(searchparams[i].indexOf('=')).substring(1);
            }

            if(searchparams[i].substring(0, searchparams[i].indexOf('=')) === 'fields'){
                fields = searchparams[i].substring(searchparams[i].indexOf('=')).substring(1);
            }

            if(searchparams[i].substring(0, searchparams[i].indexOf('=')) === 'user'){
                user = searchparams[i].substring(searchparams[i].indexOf('=')).substring(1);
            }

            if(searchparams[i].substring(0, searchparams[i].indexOf('=')) === 'tags'){
                tags = searchparams[i].substring(searchparams[i].indexOf('=')).substring(1);
            }
        }

        // form solr query parameters
        if(searchstring){
            q = 'q=' + searchstring + '';
        }
        if(entity){
            fq += '&fq=entity%3A"' + entity + '"';
        }
        if(lang){
            fq += '&fq=lang%3A"' + lang + '"';
        }
        if(group){
            console.log(group);
        }
        if(fields){
            console.log(fields);
        }
        // TODO CONTINUE WITH THE REST PARAMETERS

        if(resource === 'searchresults.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
        	//
            // let result = 'Searched for string: ' + args.searchstring + ' , result: RDF is a standard model for data';
            //let result = 'Searched for string: "RDF" , result: RDF is a standard model for data';
            // // let searchresults = [
            //     {'id': '1', 'type':'slide', 'did': '24', 'sid': '12', 'uid':'23', 'description': 'RDF is a standard model for data', 'stitle':'Introuction', 'lang':'EN'},
            //     {'id': '2', 'type':'deck', 'did': '23', 'uid':'24', 'description':'Everything about RDF is already said', 'lang':'EN'},
            //     {'id': '3', 'type':'deck_revision', 'did': '23', 'uid':'25', 'title':'What Is RDF by rewriting it from', 'lang':'EN'},
            //     {'id': '4', 'type':'deck_revision', 'did': '31', 'uid':'26', 'comment':'Introduction RDF is one of', 'lang':'ES'},
            //     {'id': '5', 'type':'answer', 'did': '', 'aid': '87', 'uid':'23', 'explanation':'Introduction to RDF including', 'lang':'GR'}
            // ];

            // let entities = [{'id': '1', 'description':'slide'}, {'id': '2', 'description':'deck'}, {'id': '3', 'description':'answer'}];
            // let languages = [{'id': '1', 'description':'EN'}, {'id': '2', 'description':'ES'}];


            // // //////SOLR TEST START//////

            let request = require('request');
            let solrQuery = 'http://slidewiki.imis.athena-innovation.gr:8983/solr/swcore/select?'
                        +q+fq+ /*'&fl=id%2C+title%2C+entity' +*/ '&wt=json&indent=true';

            console.log('QUERY: '+solrQuery);

            request({
                uri: solrQuery,
                method: 'GET'
            }, (error, response, body) => {

                solrResponse = JSON.parse(body);

                // console.log('RESPONSE: '+JSON.stringify(solrResponse));

                // console.log('qqqq');

                // let numFound=0;
                // let docs=[];
                console.log('- service results ' + solrResponse.response.numFound);

                callback(null, {
                    numFound: solrResponse.response.numFound,
                    docs: solrResponse.response.docs,
                    queryparams: args.queryparams,
                    // entities: entities,
                    // languages:languages,
                    searchstring: searchstring,
                    entity: entity,
                    lang: lang,
                    group: group,
                    fields: fields,
                    user: user,
                    tags: tags
                });


            });

            // // //////SOLR TEST END////////

        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
