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

            subscriptionsString += '/o' + uid;
            const listOfActivityTypesQuery = '?activity_type=translate&activity_type=share&activity_type=add&activity_type=edit&activity_type=move&activity_type=comment&activity_type=reply&activity_type=use&activity_type=attach&activity_type=react&activity_type=rate&activity_type=download&activity_type=fork&activity_type=delete';
            let notificationsPromise = rp.get({uri: Microservices.activities.uri + '/activities/subscribed' + subscriptionsString + listOfActivityTypesQuery}).promise().bind(this);
            let newNotificationsPromise = rp.get({uri: Microservices.notification.uri + '/notifications/' + uid + '?metaonly=false'}).promise().bind(this);

            //callback to execute when both requests are successful
            Promise.all([notificationsPromise, newNotificationsPromise]).then((res) => {

                let notifications = JSON.parse(res[0]);
                let newNotifications = JSON.parse(res[1]).items;

                callback(null, {notifications: notifications, newNotifications: newNotifications, subscriptions: subscriptions});
            }).catch((err) => {
                console.log(err);
                callback(null, {notifications: [], newNotifications: [], subscriptions: subscriptions});
            });
        } else if (resource === 'notifications.listnew'){
            rp.get({uri: Microservices.notification.uri + '/notifications/' + uid + '?metaonly=false'}).then((res) => {
                let newNotifications = JSON.parse(res).items;
                newNotifications.forEach((notification) => {
                    notification.newNotificationId = notification.id;
                });

                callback(null, {newNotifications: newNotifications});
            }).catch((err) => {
                console.log(err);
                callback(null, {newNotifications: []});
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
            const nid = args.newNotificationId;
            let options = {
                method: 'DELETE',
                uri: Microservices.notification.uri + '/notification/delete',
                body:JSON.stringify({
                    id: nid
                })
            };
            rp(options).then((res) => {
                callback(null, params);
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
    }

    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
};
