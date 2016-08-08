export default {
    name: 'history',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        if(resource === 'history.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let history;
            if (args.stype === 'slide') {
                history = [
                    {
                        'id': 3,
                        'timestamp': '2016-07-14T11:23:00.304Z',
                        'userID': 24,
                        'username': 'stavros',
                        'active': true,
                        'license': 'CC0',
                        'title': 'ghgtjhfj revision',
                        'content': 'test revifdsfdsfsion content string',
                        'speakernotes': 'ruyhtrujtj notes',
                        'parent': {
                            'id': '1500',
                            'revision': '4'
                        }
                    },
                    {
                        'id': 2,
                        'timestamp': '2016-07-12T02:12:00.304Z',
                        'userID': 21,
                        'username': 'marios',
                        'license': 'CC0',
                        'title': 'Fwrfr Revision',
                        'content': 'test jjjjjjjjjjj jg gggh',
                        'speakernotes': 'no gfhjhhg notes',
                        'parent': {
                            'id': '1500',
                            'revision': '4'
                        }
                    },
                    {
                        'id': 1,
                        'timestamp': '2016-07-12T10:12:00.304Z',
                        'userID': 21,
                        'username': 'marios',
                        'license': 'CC0',
                        'title': 'tesdsfsdft revision',
                        'content': 'ghfhgjj revifdsfdsfsion content string',
                        'speakernotes': 'no dsfsdfsdfsdfspeaker notes',
                        'parent': {
                            'id': '1500',
                            'revision': '4'
                        }
                    }

                ];
            }
            else {
                history = [
                    {
                        'id': 2,
                        'active': true,
                        'title': 'Deck title',
                        'timestamp': '2016-07-11T10:24:22.979Z',
                        'userID': 21,
                        'username': 'marios',
                        'license': 'CC0',
                        'parent': null,
                        'contentItems': [
                            {
                                'order': 2,
                                'kind': 'deck',
                                'ref': {
                                    'id': '57838d381288b578236b985e',
                                    'revision': 1
                                }
                            },
                            {
                                'order': 3,
                                'kind': 'deck',
                                'ref': {
                                    'id': '57838dfa1288b578236b985f',
                                    'revision': 1
                                }
                            },
                            {
                                'order': 4,
                                'kind': 'slide',
                                'ref': {
                                    'id': '57838e211288b578236b9860',
                                    'revision': 1
                                }
                            }
                        ]
                    },
                    {
                        'id': 1,
                        'title': 'Deck title',
                        'timestamp': '2016-07-10T07:10:22.979Z',
                        'userID': 21,
                        'username': 'marios',
                        'license': 'CC0',
                        'parent': null,
                        'contentItems': [
                            {
                                'order': 2,
                                'kind': 'deck',
                                'ref': {
                                    'id': '57838d381288b578236b985e',
                                    'revision': 1
                                }
                            },
                            {
                                'order': 3,
                                'kind': 'deck',
                                'ref': {
                                    'id': '57838dfa1288b578236b985f',
                                    'revision': 1
                                }
                            },
                            {
                                'order': 4,
                                'kind': 'slide',
                                'ref': {
                                    'id': '57838e211288b578236b9860',
                                    'revision': 1
                                }
                            }
                        ]
                    }
                ];
            }
            callback(null, {history: history, selector: selector});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
