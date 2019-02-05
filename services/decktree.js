import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import {isEmpty} from '../common.js';
const log = require('../configs/log').log;

export default {
    name: 'decktree',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
        if(resource === 'decktree.nodes'){
            let uri = Microservices.deck.uri + '/decktree/' + selector.id;
            if (args.language)
                uri += '?language=' + args.language;
            rp.get({uri: uri}).then((res) => {
                callback(null, {deckTree: JSON.parse(res), selector: selector, 'page': params.page, 'mode': args.mode, language: args.language});
            }).catch((err) => {
                //we should report the error to the action creator
                callback({msg: 'Error in retrieving data from ' + Microservices.deck.uri + ' service! Please try again later...', details: err});
            });
        } else if (resource === 'decktree.nodetranslation') {
            /*********connect to microservices*************/
            rp.get({
                uri: Microservices.deck.uri + '/decktree/node/translations',
                qs: selector,
                json: true
            }).then((res) => {
                callback(null, {translations: res, selector: selector, language: args.language});
            }).catch((err) => {
                callback(err);
            });
        }

    },
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params? params.params : params;
        let selector = {'id': String(args.selector.id), 'spath': args.selector.spath, 'sid': String(args.selector.sid), 'stype': args.selector.stype};

        if (resource === 'decktree.node') {
            /*********connect to microservices*************/
            rp.post({
                uri: Microservices.deck.uri + '/decktree/node/create',
                headers: {'----jwt----': args.jwt},
                body:JSON.stringify({
                    selector: selector,
                    nodeSpec:args.nodeSpec
                })
            }).then((res) => {
                callback(null, {node: JSON.parse(res), selector: args.selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {node: {}, selector: args.selector});
            });
        }
        else if (resource === 'decktree.nodetranslation') {
            /*********connect to microservices*************/
            rp.post({
                uri: Microservices.deck.uri + '/decktree/node/translations',
                headers: {'----jwt----': args.jwt},
                body:JSON.stringify({
                    selector: selector,
                    language: args.language
                }),
                json: true
            }).then((res) => {
                callback(null, {node: res, selector: selector, language: args.language});
            }).catch((err) => {
                console.log(err);
                callback(null, {node: {}, selector: selector, language: args.language});
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
                headers: {'----jwt----': args.jwt},
                body:JSON.stringify({
                    selector: selector,
                    name: params.newValue,
                    language: args.language
                })
            }).then((res) => {
                res = JSON.parse(res);
                // TODO remove this
                // support old style api response
                if (res.revisions) {
                    // means it's a slide
                    // the last revision is the one we (probably) want
                    res.id = res._id;
                    res.revision = res.revisions[0].id;
                }
                callback(null, res);
            }).catch((err) => {
                console.log(err);
                callback(err, params);
            });
        } else if (resource === 'decktree.move'){
            let {sourceSelector, targetSelector, targetIndex, userid} = args;
            rp.put({
                uri: Microservices.deck.uri + '/decktree/node/move',
                headers: {'----jwt----': args.jwt},
                body:JSON.stringify({
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
        } else if (resource === 'decktree.translation'){
            let {sourceSelector, targetSelector, targetIndex, userid} = args;
            rp.put({
                uri: Microservices.deck.uri + '/decktree/node/translations',
                headers: {'----jwt----': args.jwt},
                body:JSON.stringify({
                    language: args.language,
                    selector: args.selector
                }),
                json: true
            }).then((res) => {
                callback(null, res);
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
        if (resource === 'decktree.node') {
            /*********connect to microservices*************/
            let options = {
                method: 'DELETE',
                uri: Microservices.deck.uri + '/decktree/node/delete',
                headers: {'----jwt----': args.jwt},
                body: JSON.stringify({
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
        else if (resource === 'decktree.nodetranslation') {
            /*********connect to microservices*************/
            let options = {
                method: 'DELETE',
                uri: Microservices.deck.uri + '/decktree/node/translations',
                headers: {'----jwt----': args.jwt},
                body: JSON.stringify({
                    selector: selector,
                    language: args.language
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
