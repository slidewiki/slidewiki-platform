import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'usage',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        let selector = {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        if (resource === 'usage.list') {
            let usage;
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
                usage = activeRevision.usage;
                let deckPromises = [];
                //request the deck service for the decks contained in usage array. Send requests only for unique decks(not revisions)
                //and fill each usage item with the title and user id of the corresponding revision.
                let deckIds = [... new Set(usage.map((item) => item.id))];
                deckIds.forEach((deckId) => {
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
                return Promise.all(deckPromises);
            }).then((res) => {
                let userIds = [... new Set(usage.map((item) => item.user))];
                return rp.post({uri: Microservices.user.uri + '/users', body: JSON.stringify(userIds)});
            }).then((usersRes) => {
                let users = JSON.parse(usersRes);
                let usersById = {};
                users.forEach((user) => usersById[user._id] = user);
                usage.forEach((item) => {
                    item.username = usersById[item.user].username;
                });
                callback(null, {usage: usage, selector: selector});
            }).catch((err) => {
                callback(err);
            });
        }
    }
};
