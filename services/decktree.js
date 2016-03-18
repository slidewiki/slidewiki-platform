export default {
    name: 'decktree',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype};
        if(resource === 'decktree.nodes'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            //todo: on-demand loading of content to not show the whole tree at once
            let deckTree = {
                title: 'Semantic Web', id: 56, type: 'deck', children: [
                  {title: 'Introduction', id: 66, type: 'slide'},
                  {title: 'RDF Data Model', id: 67, type: 'deck',  children: [
                      {title: 'Introduction', id: 671, type: 'slide'},
                      {title: 'Serialization', id: 673, type: 'slide'},
                      {title: 'Examples', id: 678, type: 'slide'}
                  ]},
                  {title: 'SPARQL', id: 68, type: 'deck',  children: [
                      {title: 'Syntax', id: 685, type: 'deck', children: [
                          {title: 'Same Slide', id: 691, type: 'slide'},
                          {title: 'Same Slide', id: 691, type: 'slide'}
                      ]},
                      {title: 'Examples', id: 686, type: 'slide'}
                  ]
                  },
                  {title: 'Conclusion', id: 78, type: 'slide'},
                  {title: 'Future Work', id: 99, type: 'slide'},
                  {title: 'References', id: 79, type: 'slide'},
                  {title: 'Extra1', id: 739, type: 'slide'},
                  {title: 'Extra2', id: 789, type: 'slide'},
                  {title: 'Extra3', id: 799, type: 'slide'}
                ]
            };
            callback(null, {deckTree: deckTree, selector: selector, 'page': params.page, 'mode': args.mode});
        }
    },
    create: (req, resource, params, body, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'decktree.node'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let node = {};
            let rnd = Math.round(Math.random()*800) + 1;
            if(args.nodeSpec.type === 'slide'){
                if(args.nodeSpec.id){
                    //it means it is an existing node
                    node = {title: 'Existing Slide', id: 11, type: 'slide'};
                }else{
                    //need to make a new slide
                    node = {title: 'New Slide', id: rnd, type: 'slide'};
                }
            }else{
                if(args.nodeSpec.id){
                    //it means it is an existing node
                    node = {title: 'Existing Deck', id: 53, type: 'deck',  children: [
                            {title: 'Syntax', id: 685, type: 'slide'},
                            {title: 'Slide34', id: 691, type: 'slide'}
                    ]};
                }else{
                    //need to make a new slide
                    node = {title: 'New Deck', id: rnd, type: 'deck',  children: [
                            {title: 'New Slide', id: rnd, type: 'slide'}
                    ]};
                }
            }
            callback(null, {node: node, selector: args.selector});
        }
    },
    update: (req, resource, params, body, config, callback) => {
        if(resource === 'decktree.nodeTitle'){
            // only update if the value has changed
            if(params.oldValue === params.newValue){
                callback(null, params);
            }
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            callback(null, params);
        }
    },
    delete: (req, resource, params, config, callback) => {
        if(resource === 'decktree.node'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            callback(null, params);
        }
    }
};
