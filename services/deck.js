import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'deck',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params ? params.params : params;
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
                callback({msg: 'Error in retrieving slides data from ' + Microservices.deck.uri + ' service! Please try again later...', content: err}, {});
            });
            /* Create user data promise which is dependent on deck data promise */
            let userRes = deckPromise.then((deckData) => {
                // TODO Replace hard coded user id '15' with the commented JSON data;
                // This should be done when deckservice and userservice data is in sync;
                return rp.get({uri: Microservices.user.uri + '/user/' + (JSON.parse(deckData).user).toString()}); //'15'});
            });
            /* Catch errors from the user data response */
            let userPromise = userRes.catch((err) => {
                callback({msg: 'Error in retrieving user data from ' + Microservices.user.uri, content: err}, {});
            });

            /* Create promise which resolves when all the three promises are resolved or fails when any one of the three promises fails */
            Promise.all([deckPromise, slidesPromise, userPromise]).then((data) => {
                const deckData = JSON.parse(data[0]);
                const slidesData = JSON.parse(data[1]);
                const userData = JSON.parse(data[2]);
                deckData.host = req.headers.host;
                deckData.url = req.url;
                //console.log('deck data:', deckData);
                //console.log('slides data:', slidesData);
                //console.log('user data:', userData);
                callback(null, {deckData: deckData, slidesData: slidesData, userData: userData});
            }).catch((err) => {
                //console.log(err);
                callback({msg: 'Error in resolving promiese', content: err}, {});
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
            if (params.tags.length === 1 && params.tags[0].length === 0)
                params.tags = undefined;
            let toSend = {
                description: params.description ? params.description : 'empty',
                language: params.language,
                tags: params.tags,
                title: params.title,
                user: params.userid.toString(),
                license: params.license,
                new_revision: true
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
