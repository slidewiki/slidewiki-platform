import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'decktree',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': parseInt(args.id), 'spath': args.spath, 'sid': parseInt(args.sid), 'stype': args.stype};

        if(resource === 'decktree.nodes'){
            /*********connect to microservices*************/
            rp.get({uri: Microservices.deck.uri + '/decktree/' + selector.id}).then((res) => {
                callback(null, {deckTree: JSON.parse(res), selector: selector, 'page': params.page, 'mode': args.mode});
            }).catch((err) => {
                console.log(err);
                callback(null, {deckTree: {}, selector: selector, 'page': params.page, 'mode': args.mode});
            });
        }
    },
    create: (req, resource, params, body, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': parseInt(args.id), 'spath': args.spath, 'sid': parseInt(args.sid), 'stype': args.stype};
        if(resource === 'decktree.node'){
            /*********connect to microservices*************/
            rp.post({
                uri: Microservices.deck.uri + '/decktree/node/create',
                body:JSON.stringify({
                    selector: selector,
                    nodeSpec: args.nodeSpec,
                    //todo: send the right user id
                    user: 1
                })
            }).then((res) => {
                console.log(res);
                callback(null, {node: JSON.parse(res), selector: args.selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {node: {}, selector: args.selector});
            });
        }
    },
    update: (req, resource, params, body, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': parseInt(args.id), 'spath': args.spath, 'sid': parseInt(args.sid), 'stype': args.stype};
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
                    user: 1,
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
        let selector= {'id': parseInt(args.id), 'spath': args.spath, 'sid': parseInt(args.sid), 'stype': args.stype};
        if(resource === 'decktree.node'){
            /*********connect to microservices*************/
            let options = {
                method: 'DELETE',
                uri: Microservices.deck.uri + '/decktree/node/delete',
                body:JSON.stringify({
                    //todo: send the right user id
                    user: 1,
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
