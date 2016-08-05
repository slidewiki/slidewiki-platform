import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'decktree',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
        if(resource === 'decktree.nodes'){
            /*********connect to microservices*************/
            rp.get({uri: Microservices.deck.uri + '/decktree/' + selector.id}).then((res) => {
                callback(null, {deckTree: JSON.parse(res), selector: selector, 'page': params.page, 'mode': args.mode});
            }).catch((err) => {
                //console.log(err);
                //we should report the error to the action creator
                callback({msg: 'Error in retrieving data from ' + Microservices.deck.uri + ' service! Please try again later...', details: err}, {});
            });
        }
    },
    create: (req, resource, params, body, config, callback) => {
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
                    //todo: send the right user id
                    user: '1'
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
                    //todo: send the right user id
                    user: '1',
                    selector: selector,
                    name: params.newValue
                })
            }).then((res) => {
                callback(null, params);
            }).catch((err) => {
                console.log(err);
                callback(null, params);
            });
        }
    },
    delete: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
        if(resource === 'decktree.node'){
            /*********connect to microservices*************/
            let options = {
                method: 'DELETE',
                uri: Microservices.deck.uri + '/decktree/node/delete',
                body:JSON.stringify({
                    //todo: send the right user id
                    user: '1',
                    selector: selector
                })
            };
            rp(options).then((res) => {
                callback(null, params);
            }).catch((err) => {
                console.log(err);
                callback(null, params);
            });
        }
    }
};
