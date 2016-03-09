export default {
    name: 'datasource',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector = {'sid': args.sid, 'stype': args.stype};
        if (resource === 'datasource.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let datasources = [];

            switch (args.sid) {
                case '56':
                    datasources = [
                        {'title': 'http://www.sti-innsbruck.at/results/movies/serviceweb30-the-future-internet/', 'id': 231, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'deck', 'originId': '56', 'originTitle': 'Semantic Web'},
                        {'title': 'http://www.sti-innsbruck.at/dip-movie', 'id': 241, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '66', 'originTitle': 'Introduction'},
                        {'title': 'http://www.w3.org/TR/xslt', 'id': 31, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'deck', 'originId': '67', 'originTitle': 'RDF Data Model'},
                        {'title': 'Gruber, “Toward principles for the design of ontologies used or knowledge sharing?” , Int. J. Hum.-Comput. Stud., vol. 43, no. 5-6,1995', 'id': 232, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '671', 'originTitle': 'Introduction'},
                        {'title': '[Guarino, 98] Formal Ontology in Information Systems www.loa-cnr.it/Papers/FOIS98.pdf', 'id': 242, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '671', 'originTitle': 'Introduction'},
                        {'title': 'Fensel, D.; Kerrigan, M.; Zaremba, M. (Eds): Implementing Semantic Web Services: The SESA Framework. Springer 2008. ', 'id': 32, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '671', 'originTitle': 'Introduction'},
                        {'title': 'http://linkeddata.org/ (last accessed on 18.03.2009) ', 'id': 233, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '673', 'originTitle': 'Serialization'},
                        {'title': 'http://esw.w3.org/topic/TaskForces/CommunityProjects/LinkingOpenData/DataSets/Statistics, http://esw.w3.org/topic/TaskForces/CommunityProjects/LinkingOpenData/DataSets/LinkStatistics  (last accessed on 04.02.2010)', 'id': 243, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '673', 'originTitle': 'Serialization'},
                        {'title': 'Anja Jentzsch and Chris Bizer ', 'id': 33, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '673', 'originTitle': 'Serialization'},
                        {'title': 'http://www.youtube.com/watch?v=6gmP4nk0EOE', 'id': 234, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '678', 'originTitle': 'Examples'},
                        {'title': 'A Framework for Web Science; T. Berners-Lee and W. Hall and J. A. Hendler and K. O\'Hara and N. Shadbolt and D. J. Weitzner Foundations and Trends® in Web Science 1 (2006)', 'id': 244, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '678', 'originTitle': 'Examples'},
                        {'title': 'http://webscience.org/images/collide.jpg', 'id': 34, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '678', 'originTitle': 'Examples'},
                        {'title': 'http://webcast.bibalex.org/Presentations/Bebo91108.ppt', 'id': 235, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '681', 'originTitle': 'Introduction'},
                        {'title': 'RadarNetworks&NovaSpivack,2007-www.radarnetworks.com ', 'id': 245, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'deck', 'originId': '685', 'originTitle': 'Syntax'},
                        {'title': 'http://widgets-gadgets.com/2006_10_01_archive.html', 'id': 35, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'deck', 'originId': '685', 'originTitle': 'Syntax'}
                    ];

                    break;
                case '66':
                    datasources = [
                        {'title': 'http://www.sti-innsbruck.at/dip-movie', 'id': 241, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '66', 'originTitle': 'Introduction'}
                    ];
                    break;
                case '67':
                    datasources = [
                        {'title': 'http://www.w3.org/TR/xslt', 'id': 31, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'deck', 'originId': '67', 'originTitle': 'RDF Data Model'},
                        {'title': 'Gruber, “Toward principles for the design of ontologies used or knowledge sharing?” , Int. J. Hum.-Comput. Stud., vol. 43, no. 5-6,1995', 'id': 232, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '671', 'originTitle': 'Introduction'},
                        {'title': '[Guarino, 98] Formal Ontology in Information Systems www.loa-cnr.it/Papers/FOIS98.pdf', 'id': 242, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '671', 'originTitle': 'Introduction'},
                        {'title': 'Fensel, D.; Kerrigan, M.; Zaremba, M. (Eds): Implementing Semantic Web Services: The SESA Framework. Springer 2008. ', 'id': 32, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '671', 'originTitle': 'Introduction'},
                        {'title': 'http://linkeddata.org/ (last accessed on 18.03.2009) ', 'id': 233, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '673', 'originTitle': 'Serialization'},
                        {'title': 'http://esw.w3.org/topic/TaskForces/CommunityProjects/LinkingOpenData/DataSets/Statistics, http://esw.w3.org/topic/TaskForces/CommunityProjects/LinkingOpenData/DataSets/LinkStatistics  (last accessed on 04.02.2010)', 'id': 243, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '673', 'originTitle': 'Serialization'},
                        {'title': 'Anja Jentzsch and Chris Bizer ', 'id': 33, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '673', 'originTitle': 'Serialization'},
                        {'title': 'http://www.youtube.com/watch?v=6gmP4nk0EOE', 'id': 234, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '678', 'originTitle': 'Examples'},
                        {'title': 'A Framework for Web Science; T. Berners-Lee and W. Hall and J. A. Hendler and K. O\'Hara and N. Shadbolt and D. J. Weitzner Foundations and Trends® in Web Science 1 (2006)', 'id': 244, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '678', 'originTitle': 'Examples'},
                        {'title': 'http://webscience.org/images/collide.jpg', 'id': 34, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '678', 'originTitle': 'Examples'}
                    ];
                    break;
                case '671':
                    datasources = [
                        {'title': 'Gruber, “Toward principles for the design of ontologies used or knowledge sharing?” , Int. J. Hum.-Comput. Stud., vol. 43, no. 5-6,1995', 'id': 232, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '671', 'originTitle': 'Introduction'},
                        {'title': '[Guarino, 98] Formal Ontology in Information Systems www.loa-cnr.it/Papers/FOIS98.pdf', 'id': 242, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '671', 'originTitle': 'Introduction'},
                        {'title': 'Fensel, D.; Kerrigan, M.; Zaremba, M. (Eds): Implementing Semantic Web Services: The SESA Framework. Springer 2008. ', 'id': 32, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '671', 'originTitle': 'Introduction'}
                    ];
                    break;
                case '673':
                    datasources = [
                        {'title': 'http://linkeddata.org/ (last accessed on 18.03.2009) ', 'id': 233, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '673', 'originTitle': 'Serialization'},
                        {'title': 'http://esw.w3.org/topic/TaskForces/CommunityProjects/LinkingOpenData/DataSets/Statistics, http://esw.w3.org/topic/TaskForces/CommunityProjects/LinkingOpenData/DataSets/LinkStatistics  (last accessed on 04.02.2010)', 'id': 243, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '673', 'originTitle': 'Serialization'},
                        {'title': 'Anja Jentzsch and Chris Bizer ', 'id': 33, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '673', 'originTitle': 'Serialization'}
                    ];
                    break;
                case '678':
                    datasources = [
                        {'title': 'http://www.youtube.com/watch?v=6gmP4nk0EOE', 'id': 234, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '678', 'originTitle': 'Examples'},
                        {'title': 'A Framework for Web Science; T. Berners-Lee and W. Hall and J. A. Hendler and K. O\'Hara and N. Shadbolt and D. J. Weitzner Foundations and Trends® in Web Science 1 (2006)', 'id': 244, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '678', 'originTitle': 'Examples'},
                        {'title': 'http://webscience.org/images/collide.jpg', 'id': 34, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '678', 'originTitle': 'Examples'}
                    ];
                    break;
                case '68':
                    datasources = [
                        {'title': 'http://webcast.bibalex.org/Presentations/Bebo91108.ppt', 'id': 235, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '681', 'originTitle': 'Introduction'},
                        {'title': 'RadarNetworks&NovaSpivack,2007-www.radarnetworks.com ', 'id': 245, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'deck', 'originId': '685', 'originTitle': 'Syntax'},
                        {'title': 'http://widgets-gadgets.com/2006_10_01_archive.html', 'id': 35, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'deck', 'originId': '685', 'originTitle': 'Syntax'}
                    ];
                    break;
                case '681':
                    datasources = [
                        {'title': 'http://webcast.bibalex.org/Presentations/Bebo91108.ppt', 'id': 235, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'slide', 'originId': '681', 'originTitle': 'Introduction'}
                    ];
                    break;
                case '685':
                    datasources = [
                        {'title': 'RadarNetworks&NovaSpivack,2007-www.radarnetworks.com ', 'id': 245, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'deck', 'originId': '685', 'originTitle': 'Syntax'},
                        {'title': 'http://widgets-gadgets.com/2006_10_01_archive.html', 'id': 35, 'nodeType': args.stype, 'nodeId': args.sid, 'originType': 'deck', 'originId': '685', 'originTitle': 'Syntax'}
                    ];
                    break;
                default:
                    datasources = [];
            }
            callback(null, {datasources: datasources, selector: selector});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
