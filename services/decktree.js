export default {
    name: 'decktree',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'decktree.nodes'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            //position is absolute position when flatten the tree
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
                      {title: 'Introduction', id: 681, type: 'slide'},
                      {title: 'Syntax', id: 685, type: 'slide'}
                  ]
                  },
                  {title: 'Conclusion', id: 78, type: 'slide'},
                  {title: 'References', id: 79, type: 'slide'}
                ]
            };
            callback(null, {deckTree: deckTree});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
