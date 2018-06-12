import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import {isEmpty, assignToAllById} from '../common';
import slugify from 'slugify';

const log = require('../configs/log').log;

export default {
    name: 'deck',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        if (resource === 'deck.legacy'){
            rp.get({uri: Microservices.deck.uri + '/legacy/' + params.oldid}).then((res) => {
                //console.log('RES:' + res);
                callback(null, {new_id: res});
            }).catch((err) => {
                callback(err, {new_id: null});
            });
        }
        if (resource === 'deck.featured') {
            //logger.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
            /*********connect to microservices*************/
            let limit, offset = 0;
            if (args.limit) limit = args.limit;
            if (args.offset) offset = args.offset;
            rp.get({
                uri: Microservices.deck.uri + '/allfeatured/' + limit + '/' + offset,
                json: true,
            }).then((res) => {
                callback(null, {featured: addSlugs(res)});
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
            rp.get({
                uri: Microservices.deck.uri + '/allrecent/' + limit + '/' + offset,
                json: true,
            }).then((res) => {
                callback(null, {recent: addSlugs(res)});
            }).catch((err) => {
                callback(err, {recent: []});
            });
        }
        if (resource === 'deck.content') {
            log.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
            // console.log('service deck.content', args);
            /* Create promise for deck data success */
            let uri = Microservices.deck.uri + '/deck/' + args.sid;
            if (args.language)
                uri += '?language=' + args.language;
            let deckRes = rp.get({uri: uri, json: true}).then((deck) => {
                if (deck.revisions) {
                    // support old style api response
                    // TODO remove this
                    let currentRevision = deck.revisions.length === 1 ? deck.revisions[0] : deck.revisions.find((rev) => {
                        return rev.id === deck.active;
                    });
                    if (!deck.id) deck.id = deck._id;
                    deck.revision = currentRevision.id;
                    deck.revisionUser = currentRevision.user;
                    delete deck.revisions;

                    // override everything else
                    Object.assign(deck, currentRevision);
                }

                return deck;
            });
            /* Create promise for slides data success */
            let uri2 = Microservices.deck.uri + '/deck/' + args.sid + '/slides';
            if (args.language)
                uri2 += '?language=' + args.language;
            let slidesRes = rp.get({uri:uri2});
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

            // the forkCount API requires just the deck id, not the revision (a deck may be a fork of any revision)
            let deckId = parseInt(args.sid); // we rely on parseInt
            let forkCountPromise = rp.get({uri: Microservices.deck.uri + '/deck/' + deckId + '/forkCount'}).catch((err) => {
                callback({
                    msg: 'Error in retrieving fork count',
                    content: err
                }, {});
            });

            let shareCountPromise = rp.get({
                uri: Microservices.activities.uri + '/activities/deck/' + deckId + '?metaonly=true&activity_type=share&all_revisions=true',
                simple: false //By default, http response codes other than 2xx will cause the promise to be rejected. This is overwritten here
            }).catch((err) => {
                callback({
                    msg: 'Error in retrieving share count',
                    content: err
                }, {});
            });

            let downloadCountPromise = rp.get({
                uri: Microservices.activities.uri + '/activities/deck/' + deckId + '?metaonly=true&activity_type=download&all_revisions=true',
                simple: false //By default, http response codes other than 2xx will cause the promise to be rejected. This is overwritten here
            }).catch((err) => {
                callback({
                    msg: 'Error in retrieving download count',
                    content: err
                }, {});
            });

            /* Create user data promise which is dependent on deck data promise */
            let usersPromise = deckPromise.then((deck) => {
                // This should be done when deckservice and userservice data is in sync;
                let users = [deck.user, deck.revisionUser];
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
            Promise.all([deckPromise, slidesPromise, forkCountPromise, usersPromise, shareCountPromise, downloadCountPromise]).then((data) => {
                let deckData = data[0];
                deckData.forkCount = JSON.parse(data[2]);
                deckData.shareCount = JSON.parse(data[4]);
                deckData.downloadCount = JSON.parse(data[5]);

                addSlug(deckData);

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
            let uri = Microservices.deck.uri + '/deck/' + args.sid;
            if (args.language)
                uri += '?language=' + args.language;
            let deckPromise = rp.get({uri: uri, json:true}).then((deck) => {
                // TODO remove this
                if (deck.revisions) {
                    // support old style api response
                    // TODO remove this
                    let currentRevision = deck.revisions.length === 1 ? deck.revisions[0] : deck.revisions.find((rev) => {
                        return rev.id === deck.active;
                    });
                    if (!deck.id) deck.id = deck._id;
                    deck.revision = currentRevision.id;
                    deck.revisionUser = currentRevision.user;
                    delete deck.revisions;

                    // override everything else
                    Object.assign(deck, currentRevision);
                }
                return deck;
            });

            deckPromise.then((deck) => {
                // prepare users and groups from editors object
                let {users, groups} = deck.editors || {};
                if (!users) users = [];
                if (!groups) groups = [];

                return Promise.all([
                    // include users info from user service
                    fetchUserInfo(users.map((e) => e.id))
                    .then((userInfo) => assignToAllById(users, userInfo)),
                    // include groups info from user service
                    fetchGroupInfo(groups.map((g) => g.id))
                    .then((groupInfo) => assignToAllById(groups, groupInfo))
                ]).then(([users, groups]) => {
                    let deckProps = {
                        description: deck.description,
                        language: deck.language,
                        tags: deck.tags,
                        title: deck.title,
                        license: deck.license,
                        theme: deck.theme,
                        allowMarkdown: deck.allowMarkdown || false,
                        editors: { users, groups },
                        hidden: deck.hidden,
                        deckOwner: deck.user,
                        revisionOwner: deck.revisionUser,
                        sid: args.sid,
                        localRootDeck: args.id,
                        translations: deck.translations || []
                    };

                    callback(null, {
                        deckProps: deckProps,
                    });
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
                qs: args.user ? {user: args.user} : {},
                json: true
            }).then((body) => {
                callback(null, body);
            }).catch((err) => callback(err));
        } else if (resource ==='deck.slides'){

            let args = params.params ? params.params : params;
            let uri2 = Microservices.deck.uri + '/deck/' + args.id + '/slides';
            if (args.language)
                uri2 += '?language=' + args.language;
            rp.get({uri: uri2}).then((res) => {
                callback(null, {slides: JSON.parse(res).children});
            }).catch((err) => {
                callback({
                    msg: 'Error in retrieving slides data from ' + Microservices.deck.uri + ' service! Please try again later...',
                    content: err
                }, {slides: []});
            });
        } else if (resource ==='deck.requesteditrights'){

            let args = params.params ? params.params : params;
            let deckid = args.deckId;
            let index = (deckid + '').indexOf('-');
            if (index !== -1)
                deckid = deckid.substring(0, index);
            rp({
                method: 'POST',
                uri: Microservices.deck.uri + '/deck/' + deckid + '/requestEditRights',
                headers: { '----jwt----': args.jwt },
                json: true
            })
            .then((response) => {
                return callback(null, response);
            })
            .catch((err) => callback(err));
        } else if (resource === 'deck.translations') {
            rp({
                method: 'GET',
                uri: Microservices.deck.uri + '/deck/' + args.id + '/translations',
                json: true
            })
            .then((body) => {
                callback(null, body);
            })
            .catch((err) => callback(err));
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
                description: params.description,
                language: params.language,
                translation: {
                    status: 'original'
                },
                tags: params.tags,
                title: params.title,
                license: params.license,
                theme: params.theme
            };
            rp({
                method: 'POST',
                uri: Microservices.deck.uri + '/deck/new',
                json: true,
                headers: {'----jwt----': params.jwt},
                body: toSend
            }).then((deck) => {
                // support old style deck api response
                // TODO remove this
                if (deck.revisions) {
                    if (!deck.id) deck.id = deck._id;
                    deck.revision = deck.revisions[0].id;
                    deck.title = deck.revisions[0].title;

                    delete deck.revisions;
                }
                return deck;
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
        } else if (resource === 'deck.translate'){

            let toSend = {
                language: params.language
            };
            rp({
                method: 'PUT',
                uri: Microservices.deck.uri + '/deck/' + params.deckId + '/translate',
                json: true,
                headers: {'----jwt----': params.jwt},
                body: toSend
            }).then((data) => {
                //console.log('DECK:' + JSON.stringify(data.root_deck));
                callback(false, data);
            })
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
                description: params.description,
                language: params.language,
                tags: params.tags? params.tags: [],
                title: params.title,
                license: params.license,
                theme: params.theme,
                allowMarkdown: params.allowMarkdown,
                new_revision: false,
                top_root_deck: String(params.selector.id),
                tags: params.tags,
                hidden: params.hidden,
            };
            // console.log('send:', toSend, 'editors:', toSend.editors, 'to', Microservices.deck.uri + '/deck/' + params.deckId);
            rp({
                method: 'PUT',
                uri: Microservices.deck.uri + '/deck/' + params.deckId,
                json: true,
                headers: {'----jwt----': params.jwt},
                body: toSend
            }).then((deck) => {
                // support old style deck api response
                // TODO remove this
                if (deck.revisions) {
                    if (!deck.id) deck.id = deck._id;
                    deck.revision = deck.revisions[0].id;
                    deck.title = deck.revisions[0].title;

                    delete deck.revisions;
                }
                return deck;
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
            //update a deck by creating a new revision and setting it as active
        } else if (resource === 'deck.fork') {
            //logger.info({reqId: req.reqId, file: __filename.split('/').pop(), Resource: resource});
            rp({
                method: 'PUT',
                uri: Microservices.deck.uri + '/deck/' + params.deckId + '/fork',
                json: true,
                headers: {'----jwt----': params.jwt},
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
        } else if (resource === 'deck.updateTags'){

            // send tags to tag-service
            rp.post({
                uri: Microservices.tag.uri + '/tag/upload',
                json: true,
                body: {
                    user: params.userid,
                    tags: params.tags
                }
            }).then((tags) => {

                // send tagName and defaultName to deck-service
                let deckTags = tags.map( (t) => {
                    return {
                        tagName: t.tagName,
                        defaultName:  t.defaultName
                    };
                });

                rp.put({
                    uri: Microservices.deck.uri + '/deck/' + params.selector.sid + '/tags',
                    json: true,
                    body: {
                        top_root_deck: params.selector.id,
                        tags: deckTags,
                    },
                    headers: { '----jwt----': params.jwt },
                }).catch( (err) => {
                    console.log(err);
                    callback(err);
                });

                callback(null, {tags: tags});
            }).catch((err) => callback(err));
        }
        else if (resource === 'deck.translations') {
            let deckid = params.id;
            let index = (deckid + '').indexOf('-');
            if (index !== -1)
                deckid = deckid.substring(0, index);
            rp({
                method: 'POST',
                uri: Microservices.deck.uri + '/deck/' + deckid + '/translations',
                headers: { '----jwt----': params.jwt },
                json: true,
                body: {
                    language: params.language
                }
            })
            .then((body) => {
                callback(null, body);
            })
            .catch((err) => callback(err));
        }
    }
    // delete: (req, resource, params, config, callback) => {}
};

// TODO move these to lib files

// promises user public info for a list of user ids
function fetchUserInfo(userIds) {
    // return empty list if nothing provided
    if (isEmpty(userIds)) {
        return Promise.resolve([]);
    }

    return rp.post({
        uri: `${Microservices.user.uri}/users`,
        json: true,
        body: userIds,
    }).then((users) => users.map((u) => ({id: u._id, username: u.username, picture: u.picture, country: u.country, organization: u.organization}) ) );
}

// promises group public info for a list of group ids (not the users in the groups)
function fetchGroupInfo(groupIds) {
    // return empty list if nothing provided
    if (isEmpty(groupIds)) {
        return Promise.resolve([]);
    }

    return rp.post({
        uri: `${Microservices.user.uri}/usergroups`,
        json: true,
        body: groupIds,
    }).then((groups) => groups.map((g) => ({id: g.id, name: g.name}) ));
}

function addSlugs(decks) {
    if (decks.forEach) {
        // we hope it's an array :)
        return decks.map(addSlug);
    } else {
        // we guess it's just one deck object
        return addSlug(deck);
    }
}

function addSlug(deck) {
    deck.slug = slugify(deck.title || '').toLowerCase() || '_';
    if (deck.origin) {
        addSlug(deck.origin);
    };
    return deck;
}
