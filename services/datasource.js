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
            rp.get({
                uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid + '/datasources',
                qs: { countOnly: true },
                json: true,
            }).then((res) => {
                callback(null, {'count' : res.totalCount, 'selector': selector, 'mode': args.mode});
            }).catch((err) => {
                console.log(err);
                callback(null, {'count' : 0, 'selector': selector, 'mode': args.mode});
            });
        }

        if (resource === 'datasource.list') {
            //request specific content item from deck service
            rp.get({
                uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid + '/datasources',
                json: true,
            }).then((res) => {
                callback(null, {dataSources: res.items, selector: selector});
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
