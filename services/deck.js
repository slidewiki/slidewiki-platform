import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'deck',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params ? params.params : params;

        if (resource === 'deck.featured') {
            /*********connect to microservices*************/
            let limit, offset = null;
            if (args.limit) limit = args.limit;
            if (args.offset) offset = args.offset;
            rp.get({uri: Microservices.deck.uri + '/allfeatured/' + limit + '/' + offset}).then((res) => {
                callback(null, {featured: JSON.parse(res)});
            }).catch((err) => {
                callback(err, {featured: []});
            });
        }
        if (resource === 'deck.recent') {
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
            console.log(args);
            let revisionCountPromise = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid + '/revisionCount'}).catch((err) => {
                callback({
                    msg: 'Error in retrieving revisions count',
                    content: err
                }, {});
            });

            /* Create user data promise which is dependent on deck data promise */
            let usersPromise = deckPromise.then((deckData) => {
                // This should be done when deckservice and userservice data is in sync;
                let deck = JSON.parse(deckData);
                let currentRevision = deck.revisions.length === 1 ? deck.revisions[0] : deck.revisions.find((rev) => {
                    return rev.id === deck.active;
                });
                let creatorRes = rp.get({uri: Microservices.user.uri + '/user/' + deck.user.toString()});
                let ownerRes = deck.user === currentRevision.user ? creatorRes : rp.get({uri: Microservices.user.uri + '/user/' + currentRevision.user.toString()});
                return Promise.all([creatorRes, ownerRes]);
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
                    ownerData: JSON.parse(data[3][1])
                });
            }).catch((err) => {
                //console.log(err);
                callback({msg: 'Error in resolving promises', content: err}, {});
            });
        } else if (resource === 'deck.properties') {
            let deckPromise = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid}).promise().bind(this);
            let editorsPromise = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid + '/editors'}).promise().bind(this);
            Promise.all([deckPromise, editorsPromise]).then((res) => {
                let deck = JSON.parse(res[0]), editors = JSON.parse(res[1]);
                let revision;
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
                    license: revision.license != null ? revision.license : deck.license
                };
                callback(null, {
                    deckProps: deckProps,
                    editors: editors
                });
            }).catch((err) => {
                callback(err);
            });
        } else if (resource === 'deck.numberofslides') {
            let args = params.params ? params.params : params;
            rp.get({uri: Microservices.deck.uri + '/deck/' + args.id + '/slides'}).then((res) => {
                callback(null, {noofslides: JSON.parse(res).children.length});
            }).catch((err) => {
                console.log('serviceErr', err);
                callback(null, {noofslides: 0});
            });
        } else if (resource === 'deck.needsNewRevision') {
            let args = params.params ? params.params : params;
            rp.get({uri: Microservices.deck.uri + '/deck/' + args.deckID + '/needsNewRevision?user=' + args.userID}).then((res) => {
                callback(null, {status: JSON.parse(res)});
            }).catch((err) => {
                console.log('serviceErr', err);
                callback(null, {status: {}});
            });
        } else if (resource === 'deck.handleRevisionChanges') {
            let args = params.params ? params.params : params;
            rp.get({uri: Microservices.deck.uri + '/deck/' + args.deckID + '/handleChange?user=' + args.userID + '&root_deck=' + args.rootDeckID}).then((res) => {
                callback(null, {result: JSON.parse(res)});
            }).catch((err) => {
                console.log('serviceErr', err);
                callback(null, {result: {}});
            });
        }
    },
    // other methods
    create: (req, resource, params, body, config, callback) => {

        if (resource === 'deck.create') {
            if (params.tags.length === 1 && params.tags[0].length === 0)
                params.tags = undefined;
            let toSend = {
                description: params.description ? params.description : 'empty',
                language: params.language,
                translation: {
                    status: 'original'
                },
                tags: params.tags,
                title: params.title,
                user: params.userid.toString(),
                license: params.license
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
        if (resource === 'deck.update') {
            if (params.tags.length === 1 && params.tags[0].length === 0)
                params.tags = undefined;
            let toSend = {
                description: params.description ? params.description : 'empty',
                language: params.language,
                tags: params.tags,
                title: params.title,
                user: params.userid.toString(),
                license: params.license,
                new_revision: false
            };
            rp({
                method: 'PUT',
                uri: Microservices.deck.uri + '/deck/' + params.deckId,
                json: true,
                body: toSend
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
            //update a deck by creating a new revision and setting it as active
        } else if (resource === 'deck.updateWithRevision') {
            let selector = {
                'id': String(params.selector.id),
                'spath': params.selector.spath,
                'sid': String(params.selector.sid),
                'stype': params.selector.stype
            };

            if (params.tags.length === 1 && params.tags[0].length === 0)
                params.tags = undefined;
            let toSend = {
                description: params.description ? params.description : 'empty',
                language: params.language,
                tags: params.tags,
                title: params.title,
                user: params.userid.toString(),
                license: params.license,
                new_revision: true,
                top_root_deck: selector.id

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
            rp({
                method: 'PUT',
                uri: Microservices.deck.uri + '/deck/' + params.deckId + '/fork',
                json: true,
                body: {
                    user: params.userid.toString()
                }
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
        }
    }
    // delete: (req, resource, params, config, callback) => {}
};
