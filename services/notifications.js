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
        } else if (resource === 'notifications.read'){
            let id = args.id;
            rp.get({uri: Microservices.notification.uri + '/notification/markasread/' + id}).then(() => {
                callback(null, {id: id});
            }).catch((err) => {
                console.log(err);
                callback(null, {});
            });
        } else if (resource === 'notifications.readall'){
            rp.get({uri: Microservices.notification.uri + '/notifications/markallasread/' + uid}).then(() => {
                callback(null, {args: args});
            }).catch((err) => {
                console.log(err);
                callback(null, {});
            });
        }
    },
    delete: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'delete', Method: req.method});
        let args = params.params? params.params : params;

        if (resource === 'notifications.item'){
            /*********connect to microservices*************/
            const nid = args.notificationId;
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



//Mockup data
// let mockupNotifications = [
//     {
//         id: '112233445566778899000001',
//         activity_type: 'add',
//         content_id: '671',
//         content_kind: 'slide',
//         content_name: 'Introduction',
//         user_id: '2',
//         author: {
//             id: 2,
//             username: 'Nikola T.',
//             avatar: '/assets/images/mock-avatars/man_512.png'
//         },
//         new: true
//     }, {
//         id: '112233445566778899000002',
//         activity_type: 'edit',
//         content_id: '67',
//         content_kind: 'deck',
//         content_name: 'RDF Data Model',
//         user_id: '2',
//         author: {
//             id: 2,
//             username: 'Nikola T.',
//             avatar: '/assets/images/mock-avatars/man_512.png'
//         },
//         new: true
//     }, {
//         id: '112233445566778899000003',
//         activity_type: 'translate',
//         content_id: '671',
//         content_kind: 'slide',
//         content_name: 'Introduction',
//         user_id: '1',
//         translation_info: {
//             content_id: '42',
//             language: 'Serbian'
//         },
//         author: {
//             id: 1,
//             username: 'Dejan P.',
//             avatar: '/assets/images/mock-avatars/deadpool_256.png'
//         }
//     }, {
//         id: '112233445566778899000004',
//         activity_type: 'translate',
//         content_id: '671',
//         content_kind: 'slide',
//         content_name: 'Introduction',
//         user_id: '1',
//         translation_info: {
//             content_id: '43',
//             language: 'Bosnian'
//         },
//         author: {
//             id: 1,
//             username: 'Dejan P.',
//             avatar: '/assets/images/mock-avatars/deadpool_256.png'
//         }
//     }, {
//         id: '112233445566778899000005',
//         activity_type: 'translate',
//         content_id: '671',
//         content_kind: 'slide',
//         content_name: 'Introduction',
//         user_id: '1',
//         translation_info: {
//             content_id: '44',
//             language: 'Croatian'
//         },
//         author: {
//             id: 1,
//             username: 'Dejan P.',
//             avatar: '/assets/images/mock-avatars/deadpool_256.png'
//         }
//     }, {
//         id: '112233445566778899000006',
//         activity_type: 'share',
//         content_id: '67',
//         content_kind: 'deck',
//         content_name: 'RDF Data Model',
//         user_id: '2',
//         share_info: {
//             postURI: 'http://facebook.com',
//             platform: 'Facebook'
//         },
//         author: {
//             id: 2,
//             username: 'Nikola T.',
//             avatar: '/assets/images/mock-avatars/man_512.png'
//         }
//     }, {
//         id: '112233445566778899000007',
//         activity_type: 'comment',
//         content_id: '671',
//         content_kind: 'slide',
//         content_name: 'Introduction',
//         user_id: '2',
//         comment_info: {
//             comment_id: '42',
//             text: 'Awesome!'
//         },
//         author: {
//             id: 2,
//             username: 'Nikola T.',
//             avatar: '/assets/images/mock-avatars/man_512.png'
//         }
//     }, {
//         id: '112233445566778899000008',
//         activity_type: 'reply',
//         content_id: '671',
//         content_kind: 'slide',
//         content_name: 'Introduction',
//         user_id: '1',
//         comment_info: {
//             comment_id: '43',
//             text: 'Indeed'
//         },
//         author: {
//             id: 1,
//             username: 'Dejan P.',
//             avatar: '/assets/images/mock-avatars/deadpool_256.png'
//         }
//     }, {
//         id: '112233445566778899000009',
//         activity_type: 'use',
//         content_id: '671',
//         content_kind: 'slide',
//         content_name: 'Introduction',
//         user_id: '1',
//         use_info: {
//             target_id: '53',
//             target_name: 'Slidewiki Introduction'
//         },
//         author: {
//             id: 1,
//             username: 'Dejan P.',
//             avatar: '/assets/images/mock-avatars/deadpool_256.png'
//         }
//     }, {
//         id: '112233445566778899000010',
//         activity_type: 'react',
//         content_id: '671',
//         content_kind: 'slide',
//         content_name: 'Introduction',
//         user_id: '1',
//         react_type: 'like',
//         author: {
//             id: 1,
//             username: 'Dejan P.',
//             avatar: '/assets/images/mock-avatars/deadpool_256.png'
//         }
//     }, {
//         id: '112233445566778899000011',
//         activity_type: 'download',
//         content_id: '671',
//         content_kind: 'slide',
//         content_name: 'Introduction',
//         user_id: '1',
//         author: {
//             id: 1,
//             username: 'Dejan P.',
//             avatar: '/assets/images/mock-avatars/deadpool_256.png'
//         }
//     }
// ];
