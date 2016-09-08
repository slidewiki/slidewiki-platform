import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

function adjustIDs(activity) {
    activity.content_id = adjustID(activity.content_id);
    activity.user_id = adjustID(activity.user_id);
    if (activity.translation_info !== undefined)
        activity.translation_info.content_id = adjustID(activity.translation_info.content_id);
    if (activity.comment_info !== undefined)
        activity.comment_info.comment_id = adjustID(activity.comment_info.comment_id);
    if (activity.use_info !== undefined)
        activity.use_info.target_id = adjustID(activity.use_info.target_id);
}
function adjustID(id) {
    if (id.length === 24 && id.startsWith('1122334455')) {
        return id.substring(20).replace(/^0+/, '');
    }
    return id;
}

export default {
    name: 'notifications',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        const uid = args.uid;//TODO use uid when calling the service
        // let selector= {'id': parseInt(args.id), 'spath': args.spath, 'sid': parseInt(args.sid), 'stype': args.stype, 'page': params.page};

        // if (resource === 'notifications.count'){
        //     let notifications = mockupNotifications;
        //     callback(null, {'count' : notifications.length});
        // }

        if (resource === 'notifications.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/

            // let notifications = mockupNotifications;
            let subscriptionsString = '';
            // callback(null, {notifications: notifications, subscriptions: subscriptions});
            mockupSubscriptions.forEach((subscription) => {
                // const id = (!subscription.id.startsWith('1122334455')) ? ('112233445566778899000000'.substring(0, 24 - subscription.id.length) + subscription.id) : subscription.id;//TODO solve these ID issues
                const id = subscription.id;
                switch (subscription.type) {
                    case 'user':
                        subscriptionsString += '/u' + id;
                        break;
                    case 'slide':
                        subscriptionsString += '/s' + id;
                        break;
                    case 'deck':
                        subscriptionsString += '/d' + id;
                        break;
                    default:
                }
            });

            rp.get({uri: Microservices.activities.uri + '/activities/subscribed' + subscriptionsString}).then((res) => {
                let notifications = JSON.parse(res);

                notifications.forEach((notification) => adjustIDs(notification));//TODO solve these ID issues

                callback(null, {notifications: notifications, subscriptions: mockupSubscriptions});
            }).catch((err) => {
                console.log(err);
                callback(null, {notifications: {}, subscriptions: mockupSubscriptions});
            });
        } else if (resource === 'notifications.listnew'){
            rp.get({uri: Microservices.notification.uri + '/notifications/' + uid}).then((res) => {
                let newNotifications = JSON.parse(res);
                newNotifications.forEach((notification) => {
                    notification.newNotificationId = notification.id;
                    adjustIDs(notification);//TODO solve these ID issues
                });

                callback(null, {newNotifications: newNotifications});
            }).catch((err) => {
                console.log(err);
                callback(null, {newNotifications: {}});
            });
        }
    },
    delete: (req, resource, params, config, callback) => {
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
                callback(null, params);
            });
        } else if (resource === 'notifications.all'){
            /*********connect to microservices*************/
            let uid = String(args.uid);
            uid = (!uid.startsWith('1122334455')) ? ('112233445566778899000000'.substring(0, 24 - uid.length) + uid) : uid;//TODO solve these ID issues
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
                callback(null, params);
            });
        }
    }

    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}

};

let mockupSubscriptions = [
  {id:'2', type: 'user', name: 'Nikola T.', selected: true},
  {id:'1', type: 'user', name: 'Dejan P.', selected: true},
  {id:'9', type: 'deck', name: 'Collaborative authoring of presentations', selected: true},
  {id:'8', type: 'slide', name: 'Introduction', selected: true}
];

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
