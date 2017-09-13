import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'datasource',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': parseInt(args.id), 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'page': params.page};

        if (resource === 'datasource.count') {
            rp.get({uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid}).then((res) => {
                let dataSources = getDataSourcesFromDeckOrSlide(selector.sid, JSON.parse(res));
                callback(null, {'count' : dataSources.length, 'selector': selector, 'mode': args.mode});
            }).catch((err) => {
                console.log(err);
                callback(null, {'count' : 0, 'selector': selector, 'mode': args.mode});
            });
        }

        if (resource === 'datasource.list') {
            //request specific content item from deck service
            rp.get({uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid}).then((res) => {
                let parsedRes = JSON.parse(res);
                let dataSources = getDataSourcesFromDeckOrSlide(selector.sid, parsedRes);
                callback(null, {dataSources: dataSources, selector: selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {dataSources: [], selector: selector});
            });
        }
    },

    update: (req, resource, params, body, config, callback) => {
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
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

    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};

function getDataSourcesFromDeckOrSlide(id, deckOrSlide) {
    let dataSources = [];

    let contentIdParts = id.split('-');
    let contentRevisionId = (contentIdParts.length > 1) ? contentIdParts[contentIdParts.length - 1] : deckOrSlide.active;

    if (deckOrSlide.revisions !== undefined && deckOrSlide.revisions.length > 0 && deckOrSlide.revisions[0] !== null) {
        let contentRevision = (contentRevisionId !== undefined) ? deckOrSlide.revisions.find((revision) => String(revision.id) === String(contentRevisionId)) : undefined;
        if (contentRevision !== undefined) {
            dataSources = (contentRevision.dataSources !== undefined && contentRevision.dataSources !== null) ? contentRevision.dataSources : [];
        }
    }
    return dataSources;
}
