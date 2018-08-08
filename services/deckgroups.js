import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;
const async = require('async');

export default {
    name: 'deckgroups',

    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});

        let authToken = params.jwt;
        let args = params.params? params.params : params;

        let usergroups = (params.usergroups || []).map( (usergroup) => {
            return usergroup._id;
        }).join('&usergroup=');

        // suggest deck collections that this user can add decks to
        if(resource === 'deckgroups.forUser'){

            // form request call
            let uri = `${Microservices.deck.uri}/groups?user=${args.userId}`;
            if(usergroups !== ''){
                uri += `&usergroup=${usergroups}`;
            }
            uri += '&page=0&per_page=100';

            // get deck collections that the user is either admin or a creator of a user group that is associated to this collection
            rp({
                method: 'GET',
                uri: uri,
                json: true
            }).then( (deckGroups) => callback(null, deckGroups))
            .catch( (err) => callback(err));

        // get deck collections assigned to a specified deck
        } else if (resource === 'deckgroups.forDeck'){

            let deckId = args.sid;
            // check if it's a slide
            if (args.stype !== 'deck') {
                // TODO define what this service will do with slides
                deckId = args.id;
            }

            let uri = `${Microservices.deck.uri}/deck/${deckId}/groups`;
            rp({
                method: 'GET',
                uri: uri,
                json: true,
            }).then( (deckGroups) => callback(null, deckGroups))
            .catch( (err) => callback(err));

        // get the details for a specific deck collection
        } else if (resource === 'deckgroups.get'){
            rp({
                method: 'GET',
                uri: `${Microservices.deck.uri}/group/${args.id}`,
                json: true
            }).then( (group) => {

                let deckPromise = rp.get({
                    uri: `${Microservices.deck.uri}/group/${args.id}/decks`,
                    json: true,
                    headers: { '----jwt----': authToken || undefined },
                }).then((decks) =>
                    Promise.all(decks.map((deck) =>
                        rp.get({
                            uri: Microservices.activities.uri + '/activities/deck/' + deck._id + '?metaonly=true&activity_type=react&all_revisions=true'
                        }).then((noOfLikes) => Object.assign(deck, { noOfLikes }))
                    ))
                );

                // get username of the deck collection owner
                let userPromise = rp.get({
                    uri: `${Microservices.user.uri}/user/${group.user}`,
                    json: true
                }).then( (user) => {
                    return {
                        username: user.username, 
                        displayName: user.displayName || user.username
                    };
                });

                return Promise.all([deckPromise, userPromise]).then( ([decks, user]) => {
                    group.decks = decks;
                    group.user = {
                        id: group.user,
                        username: user.username, 
                        displayName: user.displayName
                    };

                    callback(null, group);
                });

            }).catch( (err) => callback(err));
        }
    },

    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params? params.params : params;

        let payload = {
            title: args.title,
            description: args.description,
            decks: []
        };

        // add userGroup if given
        if(args.userGroup !== ''){
            payload.userGroup = args.userGroup;
        }

        rp({
            method: 'POST',
            uri: `${Microservices.deck.uri}/groups`,
            json: true,
            headers: {'----jwt----': args.jwt},
            body: payload
        }).then((deckGroup) => callback(null, deckGroup))
        .catch((err) => callback(err));
    },

    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        let args = params.params? params.params : params;

        if (resource === 'deckgroups.metadata'){
            rp({
                method: 'PUT',
                uri: `${Microservices.deck.uri}/group/${args.id}`,
                json: true,
                headers: {'----jwt----': args.jwt},
                body: {
                    title: args.title,
                    description: args.description,
                    userGroup: (args.userGroup !== '') ? args.userGroup : undefined
                }
            }).then( (updated) => callback(null, updated))
            .catch((err) => callback(err));

        // update the deck order of the collection's decks
        } else if (resource === 'deckgroups.deckOrder'){
            rp({
                method: 'PUT',
                uri: `${Microservices.deck.uri}/group/${args.id}/decks`,
                json: true,
                headers: {'----jwt----': args.jwt},
                body: args.newOrder
            }).then( (updated) => callback(null, updated))
            .catch((err) => callback(err));
        } else if (resource === 'deckgroups.updateDecksOfCollection'){
            rp({
                method: 'PATCH',
                uri: `${Microservices.deck.uri}/group/${args.collectionId}/decks`,
                json: true,
                headers: {'----jwt----': args.jwt},
                body: [
                    {
                        op: args.op, 
                        deckId: args.deckId
                    }
                ]
            }).then( () => callback(null, {}))
            .catch( (err) => callback(err));
        }
    },

    delete: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'delete', Method: req.method});
        let args = params.params? params.params : params;

        if (resource === 'deckgroups.item'){
            rp({
                method: 'DELETE',
                uri: `${Microservices.deck.uri}/group/${args.id}`,
                headers: {'----jwt----': args.jwt}
            }).then((res) => {
                callback(null, res);
            }).catch((err) => {
                console.log(err);
                callback(err);
            });
        }
    }
};
