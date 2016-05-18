export default {
    name: 'notifications',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': parseInt(args.id), 'spath': args.spath, 'sid': parseInt(args.sid), 'stype': args.stype, 'page': params.page};

        if (resource === 'notifications.count'){
            let notifications = mockupNotifications;
            callback(null, {'count' : notifications.length, 'selector': selector, 'mode': args.mode});
        }

        if (resource === 'notifications.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/

            let notifications = mockupNotifications;
            callback(null, {notifications: notifications, selector: selector});
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
        activity_type: 'add',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '2',
        author: {
            id: 2,
            username: 'Dejan P.',
            avatar: '/assets/images/mock-avatars/man_512.png'
        }
    }, {
        activity_type: 'edit',
        content_id: '67',
        content_kind: 'deck',
        content_name: 'RDF Data Model',
        user_id: '2',
        author: {
            id: 2,
            username: 'Dejan P.',
            avatar: '/assets/images/mock-avatars/man_512.png'
        }
    }, {
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
            username: 'Vuk M.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
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
            username: 'Vuk M.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
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
            username: 'Vuk M.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
        activity_type: 'share',
        content_id: '67',
        content_kind: 'deck',
        content_name: 'RDF Data Model',
        user_id: '1',
        share_info: {
            postURI: 'http://facebook.com',
            platform: 'Facebook'
        },
        author: {
            id: 1,
            username: 'Vuk M.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
        activity_type: 'comment',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '1',
        comment_info: {
            comment_id: '42',
            text: 'Awesome!'
        },
        author: {
            id: 1,
            username: 'Vuk M.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
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
            username: 'Vuk M.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
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
            username: 'Vuk M.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
        activity_type: 'react',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '1',
        react_type: 'like',
        author: {
            id: 1,
            username: 'Vuk M.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }, {
        activity_type: 'download',
        content_id: '671',
        content_kind: 'slide',
        content_name: 'Introduction',
        user_id: '1',
        author: {
            id: 1,
            username: 'Vuk M.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        }
    }
];
