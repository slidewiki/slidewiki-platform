import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;
import { isEmpty } from '../common.js';

export default {
    name: 'decktree',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
        if(resource === 'decktree.nodes'){
            rp.get({uri: Microservices.deck.uri + '/decktree/' + selector.id}).then((res) => {
                callback(null, {deckTree: JSON.parse(res), selector: selector, 'page': params.page, 'mode': args.mode});
            }).catch((err) => {
                //we should report the error to the action creator
                callback({msg: 'Error in retrieving data from ' + Microservices.deck.uri + ' service! Please try again later...', details: err});
            });
        }
    },
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': String(args.selector.id), 'spath': args.selector.spath, 'sid': String(args.selector.sid), 'stype': args.selector.stype};
        let nodeSpec = {'id': String(args.nodeSpec.id), 'type': args.nodeSpec.type};
        if(resource === 'decktree.node'){
            /*********connect to microservices*************/
            rp.post({
                uri: Microservices.deck.uri + '/decktree/node/create',
                body:JSON.stringify({
                    selector: selector,
                    nodeSpec: nodeSpec,
                    user: args.userid.toString()
                })
            }).then((res) => {
                callback(null, {node: JSON.parse(res), selector: args.selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {node: {}, selector: args.selector});
            });
        }
    },
    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': String(args.selector.id), 'spath': args.selector.spath, 'sid': String(args.selector.sid), 'stype': args.selector.stype};
        if(resource === 'decktree.nodeTitle'){
            // only update if the value has changed
            if(params.oldValue === params.newValue){
                callback(null, params);
            }
            /*********connect to microservices*************/
            rp.put({
                uri: Microservices.deck.uri + '/decktree/node/rename',
                body:JSON.stringify({
                    user: args.userid.toString(),
                    selector: selector,
                    name: params.newValue
                })
            }).then((res) => {
                callback(null, JSON.parse(res));
            }).catch((err) => {
                console.log(err);
                callback(null, params);
            });
        } else if (resource === 'decktree.move'){
            let {sourceSelector, targetSelector, targetIndex, userid} = args;
            rp.put({
                uri: Microservices.deck.uri + '/decktree/node/move',
                body:JSON.stringify({
                    user: userid.toString(),
                    sourceSelector: sourceSelector,
                    targetSelector: targetSelector,
                    targetIndex: targetIndex
                })
            }).then((res) => {
                callback(null, JSON.parse(res));
            }).catch((err) => {
                console.log(err);
                callback(err);
            });
        }
    },
    delete: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'delete', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
        if(resource === 'decktree.node'){
            /*********connect to microservices*************/
            let options = {
                method: 'DELETE',
                uri: Microservices.deck.uri + '/decktree/node/delete',
                body:JSON.stringify({
                    user: args.userid.toString(),
                    selector: selector
                })
            };
            rp(options).then((res) => {
                callback(null, JSON.parse(res));
            }).catch((err) => {
                console.log(err);
                callback(null, params);
            });
        }
    }
};
