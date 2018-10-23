import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import Util from '../components/common/Util';
const log = require('../configs/log').log;

export default {
    name: 'notifications',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let uid = args.uid;
        if (uid === undefined) {
            uid = 0;
        }

        if (resource === 'notifications.list'){
            rp.get({uri: Microservices.notification.uri + '/notifications/' + uid + '?metaonly=false'}).then((res) => {
                let notifications = JSON.parse(res).items;
                
                //create path for slides - GET DECK DATA for content_root_id FROM DECK SERVICE
                let deckTreePromises = [];
                for(let notification of notifications){
                    if (notification.content_kind === 'slide' && notification.content_root_id) {
                        deckTreePromises.push(
                            rp.get({
                                uri: `${Microservices.deck.uri}/decktree/${notification.content_root_id}`,
                                json: true
                            })
                        );
                    }
                }
                
                Promise.all(deckTreePromises).then( (data) => {
                    let deckTrees = data;
                    for (let i = 0; i < deckTrees.length; i++) {
                        let deckTree = makePathForTree(deckTrees[i], []);
                        let deckId = deckTree.id;
                        let flatTree = flattenTree(deckTree);
                        for (let j = 0; j < notifications.length; j++) {
                            if (notifications[j].content_kind === 'slide' && notifications[j].content_root_id && notifications[j].content_root_id.split('-')[0] === deckId.split('-')[0]) {
                                notifications[j].slidePath = getSlidePath(notifications[j].content_id, deckId, flatTree);
                            }
                        }
                    }
                    
                    callback(null, {notifications: notifications});
                }).catch( (err) => {
                    console.log(err);
                    callback(null, {notifications: []});
                });
            }).catch((err) => {
                console.log(err);
                callback(null, {notifications: []});
            });
        } else if (resource === 'notifications.countnew'){
            rp.get({uri: Microservices.notification.uri + '/notifications/' + uid + '?metaonly=true'}).then((res) => {
                let count = JSON.parse(res).count;
                callback(null, {count: count});
            }).catch((err) => {
                console.log(err);
                callback(null, {count: 0});
            });
        }
    },
    delete: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'delete', Method: req.method});
        let args = params.params? params.params : params;

        if (resource === 'notifications.item'){
            /*********connect to microservices*************/
            const id = args.id;
            let options = {
                method: 'DELETE',
                uri: Microservices.notification.uri + '/notification/delete',
                body:JSON.stringify({
                    id: id
                })
            };
            rp(options).then((res) => {
                callback(null, {id: id});
            }).catch((err) => {
                console.log(err);
                callback(err, params);
            });
        } else if (resource === 'notifications.all'){
            /*********connect to microservices*************/
            let uid = String(args.uid);

            let options = {
                method: 'DELETE',
                uri: Microservices.notification.uri + '/notifications/delete',
                body:JSON.stringify({
                    subscribed_user_id: uid
                })
            };
            rp(options).then((res) => {
                callback(null, params);
            }).catch((err) => {
                console.log(err);
                callback(err, params);
            });
        }
    },
    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let uid = args.uid;
        if (uid === undefined) {
            uid = 0;
        }

        if (resource === 'notifications.read'){
            let id = args.id;
            rp.put({
                uri: Microservices.notification.uri + '/notification/mark/' + id,
                body: JSON.stringify({
                    read: true
                }),
                resolveWithFullResponse: true
            }).then((res) => {
                callback(null, {id: id});
            }).catch((err) => {
                console.log(err);
                callback(null, {});
            });
        } else if (resource === 'notifications.readall'){
            rp.put({
                uri: Microservices.notification.uri + '/notifications/markall/' + uid,
                body: JSON.stringify({
                    read: true
                }),
                resolveWithFullResponse: true
            }).then((res) => {
                callback(null, {args: args});
            }).catch((err) => {
                console.log(err);
                callback(null, {});
            });
        }
    }

    // other methods
    // create: (req, resource, params, body, config, callback) => {},

};

//return the position of the node in the deck
function getSlidePath(slideId, deckId, flatTree){
    let path = '';
    for (let i = 0; i < flatTree.length; i++) {
        if (flatTree[i].type === 'slide' && flatTree[i].id === slideId) {
            path = flatTree[i].path;
            let nodeSelector = {id: deckId, stype: 'slide', sid: slideId, spath: path};
            let nodeURL = Util.makeNodeURL(nodeSelector, 'deck', 'view', undefined, undefined, true);

            return nodeURL;
        }
    }
    return path;
}

//flat tree is used to avoid complex recursive functions on tree
//it is a trade off: updating the tree needs this to be synchronized
//this also propagates themes from decks to slide children
function flattenTree(deckTree, theme) {
    if (!theme) theme = deckTree.theme;

    let list = [];
    list.push({
        id: deckTree.id,
        title: deckTree.title,
        type: deckTree.type,
        path: deckTree.path,
        language: deckTree.language,
        theme: theme
    });

    if (deckTree.type === 'deck') {
        deckTree.children.forEach((item) => {
            let theme = item.theme;
            if (item.type === 'slide') theme = deckTree.theme;

            list = list.concat(flattenTree(item, theme));
        });
    }
    return list;
}

//deckTree: original deckTree from service without path
//path: array of binary id:position
function makePathForTree(deckTree, path) {
    let nodePath = makeSelectorPathString(path);
    let newTree = {
        id: deckTree.id,
        title: deckTree.title,
        type: deckTree.type,
        path: nodePath,
        theme: deckTree.theme,
        language: deckTree.language,
        selected: false,
        editable: false,
        onAction: 0
    };
    if (deckTree.type === 'deck') {
        newTree.children = [];
        newTree.expanded = true;
        deckTree.children.forEach((item, index) => {
            newTree.children.push(makePathForTree(item, path.concat([[item.id, index + 1]])) );
        });
    }
    return newTree;
}

//parses the nodePath and builds a selector path for navigation
function makeSelectorPathString(nodePath) {
    let out = [], slectorPath = '';
    nodePath.forEach((element) => {
        out.push(element.join(':'));
    });
    slectorPath = out.join(';');
    return slectorPath;
}
