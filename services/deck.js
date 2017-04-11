import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'deck',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        if (resource === 'deck.featured') {
            //logger.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
            /*********connect to microservices*************/
            let limit, offset = 0;
            if (args.limit) limit = args.limit;
            if (args.offset) offset = args.offset;
            rp.get({uri: Microservices.deck.uri + '/allfeatured/' + limit + '/' + offset}).then((res) => {
                callback(null, {featured: JSON.parse(res)});
            }).catch((err) => {
                callback(err, {featured: []});
            });
        }
        if (resource === 'deck.recent') {
            //logger.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
            /*********connect to microservices*************/
            let limit, offset = null;
            if (args.limit) limit = args.limit;
            if (args.offset) offset = args.offset;
            rp.get({uri: Microservices.deck.uri + '/allrecent/' + limit + '/' + offset}).then((res) => {
                callback(null, {recent: JSON.parse(res)});
            }).catch((err) => {
                callback(err, {featured: []});
            });
        }
        if (resource === 'deck.content') {
            //logger.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
            /* Create promise for deck data success */
            let deckRes = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid});
            /* Create promise for slides data success */
            let slidesRes = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid + '/slides'});
            /* Catch errors from deck data response */
            let deckPromise = deckRes.catch((err) => {
                callback({msg: 'Error in retrieving deck meta data ' + Microservices.deck.uri + ',', content: err}, {});
            });
            /* Catch erros from slides data response */
            let slidesPromise = slidesRes.catch((err) => {
                callback({
                    msg: 'Error in retrieving slides data from ' + Microservices.deck.uri + ' service! Please try again later...',
                    content: err
                }, {});
            });

            let revisionCountPromise = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid + '/revisionCount'}).catch((err) => {
                callback({
                    msg: 'Error in retrieving revisions count',
                    content: err
                }, {});
            });

            /* Create user data promise which is dependent on deck data promise */
            let usersPromise = deckPromise.then((deckRes) => {
                // This should be done when deckservice and userservice data is in sync;
                let deck = JSON.parse(deckRes);
                let currentRevision = deck.revisions.length === 1 ? deck.revisions[0] : deck.revisions.find((rev) => {
                    return rev.id === deck.active;
                });
                let users = [deck.user, currentRevision.user];
                if (deck.origin != null && deck.origin.user != null){
                    users.push(deck.origin.user);
                }
                let userPromisesMap = {};
                let userPromises = users.map((user) => {
                    return userPromisesMap[user] = userPromisesMap[user] || rp.get({uri: Microservices.user.uri + '/user/' + user.toString()});
                });
                return Promise.all(userPromises);
            }).catch((err) => {
                callback({msg: 'Error in retrieving user data from ' + Microservices.user.uri, content: err}, {});
            });

            /* Create promise which resolves when all the three promises are resolved or fails when any one of the three promises fails */
            Promise.all([deckPromise, slidesPromise, revisionCountPromise, usersPromise]).then((data) => {
                let deckData = JSON.parse(data[0]);
                deckData.revisionCount = JSON.parse(data[2]);
                callback(null, {
                    deckData: deckData,
                    slidesData: JSON.parse(data[1]),
                    creatorData: JSON.parse(data[3][0]),
                    ownerData: JSON.parse(data[3][1]),
                    originCreatorData: data[3][2] != null ? JSON.parse(data[3][2]) : {}
                });
            }).catch((err) => {
                //console.log(err);
                callback({msg: 'Error in resolving promises', content: err}, {});
            });
        } else if (resource === 'deck.permissions') {
            rp({
                method: 'GET',
                uri: Microservices.deck.uri + '/deck/' + args.id + '/permissions',
                headers: { '----jwt----': args.jwt },
                json: true
            })
            .then((body) => {
                callback(null, body);
            })
            .catch((err) => callback(err));
        } else if (resource === 'deck.properties') { //this is only used for deck edit - thus we call all the api routes with one service call
            //logger.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
            let deckPromise = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid}).promise().bind(this);
            let editorsPromise = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid + '/editors'}).promise().bind(this);
            Promise.all([deckPromise, editorsPromise]).then((res) => {
                let revision,
                    deck = JSON.parse(res[0]),
                    editors = JSON.parse(res[1]);
                //if deck's sid does not specify revision, find the active revision from the corresponding field
                if (args.sid.split('-').length < 2) {
                    revision = deck.revisions.find((rev) => {
                        return rev.id === deck.active;
                    });
                } else {
                    revision = deck.revisions[0];
                }
                let deckProps = {
                    description: revision.description != null ? revision.description : deck.description,
                    language: revision.language,
                    tags: revision.tags != null ? revision.tags : deck.tags,
                    title: revision.title != null ? revision.title : deck.title,
                    license: revision.license != null ? revision.license : deck.license,
                    theme: revision.theme != null ? revision.theme : deck.theme,
                    editors: editors.editors || {
                        users: [],
                        groups: []
                    },
                    deckOwner: deck.user,
                    revisionOwner: revision.user,
                    sid: args.sid,
                    localRootDeck: args.id
                };
                let contributors = (editors.contributors) ? editors.contributors.reduce((array, element) => {array.push(element.id);return array;}, []) : [];
                callback(null, {
                    deckProps: deckProps,
                    editors: contributors
                });
            }).catch((err) => {
                callback(err);
            });
        } else if (resource === 'deck.numberofslides') {
            //logger.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
            let args = params.params ? params.params : params;
            rp.get({uri: Microservices.deck.uri + '/deck/' + args.id + '/slides'}).then((res) => {
                callback(null, {noofslides: JSON.parse(res).children.length});
            }).catch((err) => {
                console.log('serviceErr', err);
                callback(null, {noofslides: 0});
            });
        } else if (resource === 'deck.forks') {
            rp({
                method: 'GET',
                uri: Microservices.deck.uri + '/deck/' + args.id.split('-')[0] + '/forks',
                qs: args.user != null ? {user: args.user} : {},
                json: true
            }).then((body) => {
                callback(null, body);
            }).catch((err) => callback(err));
        }
    },
    // other methods
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        if (resource === 'deck.create') {
            //logger.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
//            if (params.tags.length === 1 && params.tags[0].length === 0)
//                params.tags = undefined;
            let toSend = {
                description: params.description ? params.description : 'empty',
                language: params.language,
                translation: {
                    status: 'original'
                },
                tags: params.tags,
                title: params.title,
                user: params.userid.toString(),
                license: params.license,
                theme: params.theme
            };
            rp({
                method: 'POST',
                uri: Microservices.deck.uri + '/deck/new',
                json: true,
                body: toSend
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
        }
    },
    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        if (resource === 'deck.update') {
            //logger.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
            try {
                if (params.tags.length === 1 && params.tags[0].length === 0)
                    params.tags = undefined;
            } catch (e) {

            }
            let toSend = {
                description: params.description ? params.description : 'empty',
                language: params.language,
                tags: params.tags? params.tags: [],
                title: params.title,
                user: params.userid.toString(),
                license: params.license,
                theme: params.theme,
                new_revision: false,
                top_root_deck: String(params.selector.id),
            };
            // console.log('send:', toSend, 'editors:', toSend.editors, 'to', Microservices.deck.uri + '/deck/' + params.deckId);
            rp({
                method: 'PUT',
                uri: Microservices.deck.uri + '/deck/' + params.deckId,
                json: true,
                body: toSend
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
            //update a deck by creating a new revision and setting it as active
        } else if (resource === 'deck.updateWithRevision') {
            //logger.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
            let selector = {
                'id': String(params.selector.id),
                'spath': params.selector.spath,
                'sid': String(params.selector.sid),
                'stype': params.selector.stype
            };

            try {
                if (params.tags.length === 1 && params.tags[0].length === 0)
                    params.tags = undefined;
            } catch (e) {

            }
            let toSend = {
                description: params.description ? params.description : 'empty',
                language: params.language,
                tags: params.tags,
                title: params.title,
                user: params.userid.toString(),
                license: params.license,
                theme: params.theme,
                new_revision: true,
                top_root_deck: selector.id,

            };
            if (params.root_deck != null) {
                toSend.root_deck = params.root_deck;
            }
            rp({
                method: 'PUT',
                uri: Microservices.deck.uri + '/deck/' + params.deckId,
                json: true,
                body: toSend
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
        } else if (resource === 'deck.fork') {
            //logger.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
            rp({
                method: 'PUT',
                uri: Microservices.deck.uri + '/deck/' + params.deckId + '/fork',
                json: true,
                body: {
                    user: params.userid.toString()
                }
            }).then((res) => callback(false, res))
            .catch((err) => callback(err));
        }
        else if (resource === 'deck.updateEditors') {
            rp({
                method: 'PUT',
                uri: Microservices.deck.uri + '/deck/' + params.deckId + '/editors',
                json: true,
                body: {
                    editors: {
                        groups: params.editors.groups,
                        users: params.editors.users
                    }
                },
                headers: { '----jwt----': params.jwt }
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
        }
    }
    // delete: (req, resource, params, config, callback) => {}
};
