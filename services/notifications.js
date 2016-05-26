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

            let notifications = mockupNotifications;
            let subscriptions = mockupSubscriptions;
            callback(null, {notifications: notifications, subscriptions: subscriptions});
        }
    },

    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};

//Mockup data
let mockupNotifications = [
    {
        id: '112233445566778899000001',
        activity_type: 'add',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '2',
        author: {
            id: 2,
            username: 'Nikola T.',
            avatar: '/assets/images/mock-avatars/man_512.png'
        },
        new: true
    }, {
        id: '112233445566778899000002',
        activity_type: 'edit',
        content_id: '67',
        content_kind: 'deck',
        content_name: 'RDF Data Model',
        user_id: '2',
        author: {
            id: 2,
            username: 'Nikola T.',
            avatar: '/assets/images/mock-avatars/man_512.png'
        },
        new: true
    }, {
        id: '112233445566778899000003',
        activity_type: 'translate',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '1',
        translation_info: {
            content_id: '42',
            language: 'Serbian'
        },
        author: {
            id: 1,
            username: 'Dejan P.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
        id: '112233445566778899000004',
        activity_type: 'translate',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '1',
        translation_info: {
            content_id: '43',
            language: 'Bosnian'
        },
        author: {
            id: 1,
            username: 'Dejan P.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
        id: '112233445566778899000005',
        activity_type: 'translate',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '1',
        translation_info: {
            content_id: '44',
            language: 'Croatian'
        },
        author: {
            id: 1,
            username: 'Dejan P.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
        id: '112233445566778899000006',
        activity_type: 'share',
        content_id: '67',
        content_kind: 'deck',
        content_name: 'RDF Data Model',
        user_id: '2',
        share_info: {
            postURI: 'http://facebook.com',
            platform: 'Facebook'
        },
        author: {
            id: 2,
            username: 'Nikola T.',
            avatar: '/assets/images/mock-avatars/man_512.png'
        }
    }, {
        id: '112233445566778899000007',
        activity_type: 'comment',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '2',
        comment_info: {
            comment_id: '42',
            text: 'Awesome!'
        },
        author: {
            id: 2,
            username: 'Nikola T.',
            avatar: '/assets/images/mock-avatars/man_512.png'
        }
    }, {
        id: '112233445566778899000008',
        activity_type: 'reply',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '1',
        comment_info: {
            comment_id: '43',
            text: 'Indeed'
        },
        author: {
            id: 1,
            username: 'Dejan P.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
        id: '112233445566778899000009',
        activity_type: 'use',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '1',
        use_info: {
            target_id: '53',
            target_name: 'Slidewiki Introduction'
        },
        author: {
            id: 1,
            username: 'Dejan P.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
        id: '112233445566778899000010',
        activity_type: 'react',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '1',
        react_type: 'like',
        author: {
            id: 1,
            username: 'Dejan P.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
        id: '112233445566778899000011',
        activity_type: 'download',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '1',
        author: {
            id: 1,
            username: 'Dejan P.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }
];

let mockupSubscriptions = [
  {id:'2', type: 'user', name: 'Nikola T.', selected: true},
  {id:'1', type: 'user', name: 'Dejan P.', selected: true},
  {id:'67', type: 'deck', name: 'RDF Data Model', selected: true},
  {id:'671', type: 'slide', name: 'Introduction', selected: true}
];
