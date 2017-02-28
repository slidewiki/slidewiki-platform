import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import _ from 'lodash';

export default {
    name: 'usage',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params ? params.params : params;
        let selector = {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        if (resource === 'usage.list') {
            //request specific node
            rp.get({uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid}).then((res) => {
                let contentItem = JSON.parse(res);
                let activeRevision;
                //if deck's sid does not specify revision, find the active revision from the corresponding field
                if (args.stype === 'deck' && args.sid.split('-').length < 2) {
                    activeRevision = contentItem.revisions.find((rev) => {
                        return rev.id === contentItem.active;
                    });
                } else {
                    activeRevision = contentItem.revisions[0];
                }
                let usage = activeRevision.usage;

                let deckPromises = [];
                //request the deck service for the decks contained in usage array. Send requests only for unique decks(not revisions)
                //and fill each usage item with the title and user id of the corresponding revision.
                _.uniqBy(usage.map((item) => item.id), 'id').forEach((deckId) => {
                    deckPromises.push(rp.get({uri: Microservices.deck.uri + '/deck/' + deckId}).then((res) => {
                        let deck = JSON.parse(res);
                        usage.forEach((usageItem) => {
                            if (usageItem.id === deckId) {
                                let revision = deck.revisions.find((rev) => {
                                    return rev.id === usageItem.revision;
                                });
                                usageItem.title = revision.title;
                                usageItem.user = revision.user;
                            }
                        });
                    }));
                });
                //when all deck data is fetched ask the user service so as to fill in the username for every usage item
                Promise.all(deckPromises).then(() => {
                    let userPromises = [], userNames = {};
                    _.uniqBy(usage.map((item) => item.user), 'user').forEach((userId) => {
                        userPromises.push(rp.get({uri: Microservices.user.uri + '/user/' + userId}).then((userRes) => {
                            let user = JSON.parse(userRes);
                            userNames[user._id] = user.username;
                        }));
                    });
                    //when all user data is fetched fill in the usernames
                    Promise.all(userPromises).then(() => {
                        usage.forEach((usageItem) => {
                            usageItem.username = userNames[usageItem.user];
                        });
                        callback(null, {usage: usage, selector: selector});
                    }).catch((err) => {
                        console.log(err);
                        callback(err);
                    });
                }).catch((err) => {
                    console.log(err);
                    callback(err);
                });
            }).catch((err) => {
                console.log(err);
                callback(err);
            });
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
