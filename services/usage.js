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
            rp.get({uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid + '/usage'}).then((res) => {
                usage = JSON.parse(res);
                let deckPromises = [];
                //request the deck service for the decks contained in usage array. Send requests only for unique decks(not revisions)
                //and fill each usage item with the title and user id of the corresponding revision.
                let deckIds = [... new Set(usage.map((item) => item.id))];
                deckIds.forEach((deckId) => {
                    deckPromises.push(rp.get({uri: Microservices.deck.uri + '/deck/' + deckId + '/revisions'}).then((res) => {
                        let deckRevisions = JSON.parse(res);
                        usage.forEach((usageItem) => {
                            if (usageItem.id === deckId) {
                                let revision = deckRevisions.find((rev) => {
                                    return rev.id === usageItem.revision;
                                });
                                usageItem.title = revision.title;
                                usageItem.user = revision.user;
                            }
                        });
                    }));
                });
                return Promise.all(deckPromises);
            }).then(() => {
                let userIds = [... new Set(usage.map((item) => item.user))];
                if (!userIds.length){
                    return;
                }
                return rp.post({uri: Microservices.user.uri + '/users', body: userIds, json: true}).then((users) => {
                    usage.forEach((item) => {
                        item.username = users.find((user) => user._id === item.user).username;
                        item.displayName = users.find((user) => user._id === item.user).displayName;
                    });
                });
            }).then(() => {
                callback(null, {usage: usage, selector: selector});
            }).catch((err) => {
                callback(err);
            });
        }
    }
};
