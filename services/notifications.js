import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
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

            let subscriptionsString = '';
            // let mockupSubscriptions = [
            //   {id:'2', type: 'user', name: 'Nikola T.', selected: true},
            //   {id:'1', type: 'user', name: 'Dejan P.', selected: true},
            //   {id:'9', type: 'deck', name: 'Collaborative authoring of presentations', selected: true},
            //   {id:'8', type: 'slide', name: 'Introduction', selected: true}
            // ];
            // mockupSubscriptions.push({id:String(uid), type: 'owner', name: 'My decks and slides', selected: true});
            let subscriptions = [{id:String(uid), type: 'owner', name: 'My decks and slides', selected: true}];

            rp.get({uri: Microservices.notification.uri + '/notifications/' + uid + '?metaonly=false'}).then((res) => {
                let notifications = JSON.parse(res).items;
                callback(null, {notifications: notifications, subscriptions: subscriptions});
            }).catch((err) => {
                console.log(err);
                callback(null, {notifications: [], subscriptions: subscriptions});
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
                uri: Microservices.notification.uri + '/notification/markall/' + uid,
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
    //

};
