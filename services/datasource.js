import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'datasource',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': parseInt(args.id), 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'page': params.page};

        //not used - the data is already in the store
        // if (resource === 'datasource.item'){
        //     let dataSource = {};
        //
        //     dataSource = mockupDataSources.find((ds) => {return ds.dsid === args.dsid;});
        //
        //     //mockupdatasources.forEach((item) => {
        //     //    if (item.id === parseInt(args.dsid)) {
        //     //        datasource = item;
        //     //        break;
        //     //    }
        //     //});
        //
        //     callback(null, {datasource: dataSource});
        // }
        if (resource === 'datasource.count') {
            rp.get({uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid}).then((res) => {
                let dataSources = getDataSourcesFromDeckOrSlide(selector.sid, JSON.parse(res)).dataSources;
                callback(null, {'count' : dataSources.length, 'selector': selector, 'mode': args.mode});
            }).catch((err) => {
                console.log(err);
                callback(null, {'count' : 0, 'selector': selector, 'mode': args.mode});
            });
            // let dataSources = getMockupDataSourcesForID(args.sid);
            // callback(null, {'count' : dataSources.length, 'selector': selector, 'mode': args.mode});
        }

        if (resource === 'datasource.list') {
            //request specific content item from deck service
            rp.get({uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid}).then((res) => {
                let parsedRes = JSON.parse(res);
                let dataSourcesObject = getDataSourcesFromDeckOrSlide(selector.sid, parsedRes);
                let dataSources = dataSourcesObject.dataSources;
                let revisionOwner = dataSourcesObject.revisionOwner;
                callback(null, {dataSources: dataSources, owner: revisionOwner, selector: selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {dataSources: [], selector: selector});
            });

            // let dataSources = getMockupDataSourcesForID(args.sid);
            // callback(null, {datasources: dataSources, selector: selector});
        }
    },

    update: (req, resource, params, body, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'datasource.array') {
            rp.put({
                uri: Microservices.deck.uri + '/slide/datasources/' + args.sid,
                body:JSON.stringify({
                    dataSources: args.dataSources
                })
            }).then((res) => {
                callback(null, args);
            }).catch((err) => {
                console.log(err);
                callback(err, {dataSources: []});
            });
        }
    },

    // create: (req, resource, params, body, config, callback) => {
    //     let args = params.params? params.params : params;
    //     if(resource === 'datasource.new') {
    //         /*********connect to microservices*************/
    //         //todo
    //         /*********received data from microservices*************/
    //         callback(null, args);
    //     }
    // }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};

function getDataSourcesFromDeckOrSlide(id, deckOrSlide) {
    let dataSources = [];
    let revisionOwner = 0;

    let contentIdParts = id.split('-');
    let contentRevisionId = (contentIdParts.length > 1) ? contentIdParts[contentIdParts.length - 1] : deckOrSlide.active;

    if (deckOrSlide.revisions !== undefined && deckOrSlide.revisions.length > 0 && deckOrSlide.revisions[0] !== null) {
        let contentRevision = (contentRevisionId !== undefined) ? deckOrSlide.revisions.find((revision) => String(revision.id) === String(contentRevisionId)) : undefined;
        if (contentRevision !== undefined) {
            dataSources = (contentRevision.dataSources !== undefined && contentRevision.dataSources !== null) ? contentRevision.dataSources : [];
            revisionOwner = contentRevision.user;
        }
    }
    return {dataSources: dataSources, revisionOwner: revisionOwner};
}

//Mockup data
// let mockupDataSources = [
//     {'type': 'webpage', 'title': 'Movies | STI Innsbruck', 'url': 'http://www.sti-innsbruck.at/results/movies/serviceweb30-the-future-internet/', 'comment': '', 'id': 231, 'sid': '8', 'stitle': 'Introduction'},
//     {'type': 'webpage', 'title': 'Research | STI Innsbruck', 'url': 'http://www.sti-innsbruck.at/research', 'comment': '', 'id': 241, 'sid': '8', 'stitle': 'Introduction'},
//     {'type': 'webpage', 'title': 'XSL Transformations (XSLT)', 'url': 'http://www.w3.org/TR/xslt', 'comment': '', 'id': 31, 'sid': '8', 'stitle': 'Introduction'},
//     {'type': 'publication', 'title': '“Toward principles for the design of ontologies used or knowledge sharing?” , Int. J. Hum.-Comput. Stud., vol. 43, no. 5-6', 'url': '', 'comment': '', 'authors': 'Gruber', 'year': '1995.', 'id': 232, 'sid': '14', 'stitle': 'Motivation'},
//     {'type': 'webdocument', 'title': '[Guarino, 98] Formal Ontology in Information Systems', 'url': 'www.loa-cnr.it/Papers/FOIS98.pdf', 'comment': '', 'id': 242, 'sid': '14', 'stitle': 'Motivation'},
//     {'type': 'publication', 'title': 'Implementing Semantic Web Services: The SESA Framework. Springer 2008. ', 'url': '', 'comment': '', 'authors': 'Fensel, D.; Kerrigan, M.; Zaremba, M.', 'year': '2008.', 'id': 32, 'sid': '16', 'stitle': 'SlideWiki for Humanity'},
//     {'type': 'webpage', 'title': 'Linked Data - Connect Distributed Data across the Web', 'url': 'http://linkeddata.org/', 'comment': 'last accessed on 18.03.2009', 'id': 233, 'sid': '16', 'stitle': 'SlideWiki for Humanity'},
//     {'type': 'plaintext', 'title': 'Radar Networks & Nova Spivack, 2007', 'url': '', 'comment': '', 'id': 243, 'sid': '16', 'stitle': 'SlideWiki for Humanity'},
//     {'type': 'person', 'title': 'Chris Bizer', 'url': '', 'comment': '', 'id': 33, 'sid': '16', 'stitle': 'SlideWiki for Humanity'},
//     {'type': 'webpage', 'title': 'YouTube: Web 2.0 ... The Machine is Using Us', 'url': 'http://www.youtube.com/watch?v=6gmP4nk0EOE', 'comment': '', 'id': 234, 'sid': '10', 'stitle': 'Revisioning'},
//     {'type': 'publication', 'title': 'A Framework for Web Science - Foundations and Trends® in Web Science 1', 'url': '', 'comment': '', 'authors': 'T. Berners-Lee and W. Hall and J. A. Hendler and K. O\'Hara and N. Shadbolt and D. J. Weitzner', 'year': '2006.', 'id': 244, 'sid': '10', 'stitle': 'Revisioning'},
//     {'type': 'webdocument', 'title': 'Semantic web stack', 'url': 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Semantic_web_stack.svg', 'comment': '', 'id': 34, 'sid': '10', 'stitle': 'Revisioning'},
//     {'type': 'webdocument', 'title': 'The emergence of web science', 'url': 'http://webcast.bibalex.org/Presentations/Bebo91108.ppt', 'comment': '', 'id': 235, 'sid': '11', 'stitle': 'Persistent URL Scheme'},
//     {'type': 'plaintext', 'title': 'RadarNetworks&NovaSpivack,2007-www.radarnetworks.com ', 'url': '', 'comment': '', 'id': 245, 'sid': '11', 'stitle': 'Persistent URL Scheme'},
//     {'type': 'webpage', 'title': 'Widgets for Web 2.0', 'url': 'http://widgets-gadgets.com/2006_10_01_archive.html', 'comment': '', 'id': 35, 'sid': '19', 'stitle': 'Visibility, Licensing and Attribution'}
// ];

// function getMockupDataSourcesForID(sid) {
//     const idWithoutDash = sid.split('-')[0];//remove revision version
//     let dataSources = [];
//
//     switch (idWithoutDash) {
//         case '7':
//             dataSources = mockupDataSources;
//             break;
//         case '8':
//             dataSources = mockupDataSources.slice(0,2);
//             break;
//         case '14':
//             dataSources = mockupDataSources.slice(3,4);
//             break;
//         case '16':
//             dataSources = mockupDataSources.slice(5,8);
//             break;
//         case '10':
//             dataSources = mockupDataSources.slice(9,11);
//             break;
//         case '11':
//             dataSources = mockupDataSources.slice(12,13);
//             break;
//         case '19':
//             dataSources = mockupDataSources.slice(14,14);
//             break;
//         case '9'://deck
//             dataSources = mockupDataSources.slice(9,15);
//             break;
//         default:
//             dataSources = mockupDataSources;
//     }
//
//     return dataSources;
// }
