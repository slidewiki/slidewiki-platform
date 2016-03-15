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
                        {'type': 'webpage', 'title': 'Movies | STI Innsbruck', 'url': 'http://www.sti-innsbruck.at/results/movies/serviceweb30-the-future-internet/', 'comment': '', 'id': 231, 'sid': '66', 'stitle': 'Introduction'},
                        {'type': 'webpage', 'title': 'Research | STI Innsbruck', 'url': 'http://www.sti-innsbruck.at/research', 'comment': '', 'id': 241, 'sid': '66', 'stitle': 'Introduction'},
                        {'type': 'webpage', 'title': 'XSL Transformations (XSLT)', 'url': 'http://www.w3.org/TR/xslt', 'comment': '', 'id': 31, 'sid': '671', 'stitle': 'Introduction'},
                        {'type': 'publication', 'title': '“Toward principles for the design of ontologies used or knowledge sharing?” , Int. J. Hum.-Comput. Stud., vol. 43, no. 5-6', 'url': '', 'comment': '', 'authors': 'Gruber', 'year': '1995.', 'id': 232, 'sid': '671', 'stitle': 'Introduction'},
                        {'type': 'webdocument', 'title': '[Guarino, 98] Formal Ontology in Information Systems', 'url': 'www.loa-cnr.it/Papers/FOIS98.pdf', 'comment': '', 'id': 242, 'sid': '671', 'stitle': 'Introduction'},
                        {'type': 'publication', 'title': 'Implementing Semantic Web Services: The SESA Framework. Springer 2008. ', 'url': '', 'comment': '', 'authors': 'Fensel, D.; Kerrigan, M.; Zaremba, M.', 'year': '2008.', 'id': 32, 'sid': '671', 'stitle': 'Introduction'},
                        {'type': 'webpage', 'title': 'Linked Data - Connect Distributed Data across the Web', 'url': 'http://linkeddata.org/', 'comment': 'last accessed on 18.03.2009', 'id': 233, 'sid': '673', 'stitle': 'Serialization'},
                        {'type': 'plaintext', 'title': 'Radar Networks & Nova Spivack, 2007', 'url': '', 'comment': '', 'id': 245, 'sid': '673', 'stitle': 'Serialization'},
                        {'type': 'person', 'title': 'Chris Bizer', 'url': '', 'comment': '', 'id': 33, 'sid': '673', 'stitle': 'Serialization'},
                        {'type': 'webpage', 'title': 'YouTube: Web 2.0 ... The Machine is Using Us', 'url': 'http://www.youtube.com/watch?v=6gmP4nk0EOE', 'comment': '', 'id': 234, 'sid': '678', 'stitle': 'Examples'},
                        {'type': 'publication', 'title': 'A Framework for Web Science - Foundations and Trends® in Web Science 1', 'url': '', 'comment': '', 'authors': 'T. Berners-Lee and W. Hall and J. A. Hendler and K. O\'Hara and N. Shadbolt and D. J. Weitzner', 'year': '2006.', 'id': 244, 'sid': '678', 'stitle': 'Examples'},
                        {'type': 'webdocument', 'title': 'Semantic web stack', 'url': 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Semantic_web_stack.svg', 'comment': '', 'id': 34, 'sid': '678', 'stitle': 'Examples'},
                        {'type': 'webdocument', 'title': 'The emergence of web science', 'url': 'http://webcast.bibalex.org/Presentations/Bebo91108.ppt', 'comment': '', 'id': 235, 'sid': '681', 'stitle': 'Introduction'},
                        {'type': 'plaintext', 'title': 'RadarNetworks&NovaSpivack,2007-www.radarnetworks.com ', 'url': '', 'comment': '', 'id': 245, 'sid': '681', 'stitle': 'Introduction'},
                        {'type': 'webpage', 'title': 'Widgets for Web 2.0', 'url': 'http://widgets-gadgets.com/2006_10_01_archive.html', 'comment': '', 'id': 35, 'sid': '681', 'stitle': 'Introduction'}
                    ];
                    break;
                case '66':
                    datasources = [
                      {'type': 'webpage', 'title': 'Movies | STI Innsbruck', 'url': 'http://www.sti-innsbruck.at/results/movies/serviceweb30-the-future-internet/', 'comment': '', 'id': 231, 'sid': '66', 'stitle': 'Introduction'},
                      {'type': 'webpage', 'title': 'Research | STI Innsbruck', 'url': 'http://www.sti-innsbruck.at/research', 'comment': '', 'id': 241, 'sid': '66', 'stitle': 'Introduction'}
                    ];
                    break;
                case '67':
                    datasources = [
                      {'type': 'webpage', 'title': 'XSL Transformations (XSLT)', 'url': 'http://www.w3.org/TR/xslt', 'comment': '', 'id': 31, 'sid': '671', 'stitle': 'Introduction'},
                      {'type': 'publication', 'title': '“Toward principles for the design of ontologies used or knowledge sharing?” , Int. J. Hum.-Comput. Stud., vol. 43, no. 5-6', 'url': '', 'comment': '', 'authors': 'Gruber', 'year': '1995.', 'id': 232, 'sid': '671', 'stitle': 'Introduction'},
                      {'type': 'webdocument', 'title': '[Guarino, 98] Formal Ontology in Information Systems', 'url': 'www.loa-cnr.it/Papers/FOIS98.pdf', 'comment': '', 'id': 242, 'sid': '671', 'stitle': 'Introduction'},
                      {'type': 'publication', 'title': 'Implementing Semantic Web Services: The SESA Framework. Springer 2008. ', 'url': '', 'comment': '', 'authors': 'Fensel, D.; Kerrigan, M.; Zaremba, M.', 'year': '2008.', 'id': 32, 'sid': '671', 'stitle': 'Introduction'},
                        {'type': 'webpage', 'title': 'Linked Data - Connect Distributed Data across the Web', 'url': 'http://linkeddata.org/', 'comment': 'last accessed on 18.03.2009', 'id': 233, 'sid': '673', 'stitle': 'Serialization'},
                        {'type': 'webpage', 'title': 'TaskForces/CommunityProjects/LinkingOpenData/DataSets/Statistics', 'url': 'http://esw.w3.org/topic/TaskForces/CommunityProjects/LinkingOpenData/DataSets/Statistics', 'comment': 'last accessed on 04.02.2010', 'id': 243, 'sid': '673', 'stitle': 'Serialization'},
                        {'type': 'person', 'title': 'Chris Bizer ', 'url': '', 'comment': '', 'id': 33, 'sid': '673', 'stitle': 'Serialization'},
                        {'type': 'webpage', 'title': 'YouTube: Web 2.0 ... The Machine is Using Us', 'url': 'http://www.youtube.com/watch?v=6gmP4nk0EOE', 'comment': '', 'id': 234, 'sid': '678', 'stitle': 'Examples'},
                        {'type': 'publication', 'title': 'A Framework for Web Science - Foundations and Trends® in Web Science 1', 'url': '', 'comment': '', 'authors': 'T. Berners-Lee and W. Hall and J. A. Hendler and K. O\'Hara and N. Shadbolt and D. J. Weitzner', 'year': '2006.', 'id': 244, 'sid': '678', 'stitle': 'Examples'},
                        {'type': 'webdocument', 'title': 'Semantic web stack', 'url': 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Semantic_web_stack.svg', 'comment': '', 'id': 34, 'sid': '678', 'stitle': 'Examples'},
                    ];
                    break;
                case '671':
                    datasources = [
                      {'type': 'webpage', 'title': 'XSL Transformations (XSLT)', 'url': 'http://www.w3.org/TR/xslt', 'comment': '', 'id': 31, 'sid': '671', 'stitle': 'Introduction'},
                      {'type': 'publication', 'title': '“Toward principles for the design of ontologies used or knowledge sharing?” , Int. J. Hum.-Comput. Stud., vol. 43, no. 5-6', 'url': '', 'comment': '', 'authors': 'Gruber', 'year': '1995.', 'id': 232, 'sid': '671', 'stitle': 'Introduction'},
                      {'type': 'webdocument', 'title': '[Guarino, 98] Formal Ontology in Information Systems', 'url': 'www.loa-cnr.it/Papers/FOIS98.pdf', 'comment': '', 'id': 242, 'sid': '671', 'stitle': 'Introduction'},
                      {'type': 'publication', 'title': 'Implementing Semantic Web Services: The SESA Framework. Springer 2008. ', 'url': '', 'comment': '', 'authors': 'Fensel, D.; Kerrigan, M.; Zaremba, M.', 'year': '2008.', 'id': 32, 'sid': '671', 'stitle': 'Introduction'}
                    ];
                    break;
                case '673':
                    datasources = [
                        {'type': 'webpage', 'title': 'Linked Data - Connect Distributed Data across the Web', 'url': 'http://linkeddata.org/', 'comment': 'last accessed on 18.03.2009', 'id': 233, 'sid': '673', 'stitle': 'Serialization'},
                        {'type': 'webpage', 'title': 'TaskForces/CommunityProjects/LinkingOpenData/DataSets/Statistics', 'url': 'http://esw.w3.org/topic/TaskForces/CommunityProjects/LinkingOpenData/DataSets/Statistics', 'comment': 'last accessed on 04.02.2010', 'id': 243, 'sid': '673', 'stitle': 'Serialization'},
                        {'type': 'person', 'title': 'Chris Bizer', 'url': '', 'comment': '', 'id': 33, 'sid': '673', 'stitle': 'Serialization'}
                    ];
                    break;
                case '678':
                    datasources = [
                        {'type': 'webpage', 'title': 'YouTube: Web 2.0 ... The Machine is Using Us', 'url': 'http://www.youtube.com/watch?v=6gmP4nk0EOE', 'comment': '', 'id': 234, 'sid': '678', 'stitle': 'Examples'},
                        {'type': 'publication', 'title': 'A Framework for Web Science - Foundations and Trends® in Web Science 1', 'url': '', 'comment': '', 'authors': 'T. Berners-Lee and W. Hall and J. A. Hendler and K. O\'Hara and N. Shadbolt and D. J. Weitzner', 'year': '2006.', 'id': 244, 'sid': '678', 'stitle': 'Examples'},
                        {'type': 'webdocument', 'title': 'Semantic web stack', 'url': 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Semantic_web_stack.svg', 'comment': '', 'id': 34, 'sid': '678', 'stitle': 'Examples'},
                    ];
                    break;
                case '68':
                    datasources = [
                        {'type': 'webdocument', 'title': 'The emergence of web science', 'url': 'http://webcast.bibalex.org/Presentations/Bebo91108.ppt', 'comment': '', 'id': 235, 'sid': '681', 'stitle': 'Introduction'},
                        {'type': 'plaintext', 'title': 'RadarNetworks&NovaSpivack,2007-www.radarnetworks.com ', 'url': '', 'comment': '', 'id': 245, 'sid': '681', 'stitle': 'Introduction'},
                        {'type': 'webpage', 'title': 'Widgets for Web 2.0', 'url': 'http://widgets-gadgets.com/2006_10_01_archive.html', 'comment': '', 'id': 35, 'sid': '681', 'stitle': 'Introduction'}
                    ];
                    break;
                case '681':
                    datasources = [
                      {'type': 'webdocument', 'title': 'The emergence of web science', 'url': 'http://webcast.bibalex.org/Presentations/Bebo91108.ppt', 'comment': '', 'id': 235, 'sid': '681', 'stitle': 'Introduction'},
                      {'type': 'plaintext', 'title': 'RadarNetworks&NovaSpivack,2007-www.radarnetworks.com ', 'url': '', 'comment': '', 'id': 245, 'sid': '681', 'stitle': 'Introduction'},
                      {'type': 'webpage', 'title': 'Widgets for Web 2.0', 'url': 'http://widgets-gadgets.com/2006_10_01_archive.html', 'comment': '', 'id': 35, 'sid': '681', 'stitle': 'Introduction'}
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
