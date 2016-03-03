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
                {'title': 'http://www.sti-innsbruck.at/results/movies/serviceweb30-the-future-internet/', 'id': 231},
                {'title': 'http://www.sti-innsbruck.at/dip-movie', 'id': 241},
                {'title': 'http://www.w3.org/TR/xslt', 'id': 31},
                {'title': 'Gruber, “Toward principles for the design of ontologies used or knowledge sharing?” , Int. J. Hum.-Comput. Stud., vol. 43, no. 5-6,1995', 'id': 232},
                {'title': '[Guarino, 98] Formal Ontology in Information Systems www.loa-cnr.it/Papers/FOIS98.pdf', 'id': 242},
                {'title': 'Fensel, D.; Kerrigan, M.; Zaremba, M. (Eds): Implementing Semantic Web Services: The SESA Framework. Springer 2008. ', 'id': 32},
                {'title': 'http://linkeddata.org/ (last accessed on 18.03.2009) ', 'id': 233},
                {'title': 'http://esw.w3.org/topic/TaskForces/CommunityProjects/LinkingOpenData/DataSets/Statistics, http://esw.w3.org/topic/TaskForces/CommunityProjects/LinkingOpenData/DataSets/LinkStatistics  (last accessed on 04.02.2010)', 'id': 243},
                {'title': 'Anja Jentzsch and Chris Bizer ', 'id': 33},
                {'title': 'http://www.youtube.com/watch?v=6gmP4nk0EOE', 'id': 234},
                {'title': 'A Framework for Web Science; T. Berners-Lee and W. Hall and J. A. Hendler and K. O\'Hara and N. Shadbolt and D. J. Weitzner Foundations and Trends® in Web Science 1 (2006)', 'id': 244 },
                {'title': 'http://webscience.org/images/collide.jpg', 'id': 34}
            ];
            callback(null, {datasources: datasources});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
