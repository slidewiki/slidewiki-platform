export default {
    name: 'datasource',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'datasource.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let datasources = [
                {'title': 'https://www.w3.org/wiki/TaskForces/CommunityProjects/LinkingOpenData/DataSets/Statistics', 'id': 231},
                {'title': 'Figures taken from Wikipedia #sid=' + args.sid, 'id': 243},
                {'title': '[Guarino, 98] Formal Ontology in Information Systems (http://www.loa-cnr.it/Papers/FOIS98.pdf) #sid=' + args.sid, 'id': 31},
            ];
            callback(null, {datasources: datasources});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
