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
                _.uniqBy(usage.map((item) => item.id), 'id').forEach((deckId) => {
                    deckPromises.push(rp.get({uri: Microservices.deck.uri + '/deck/' + deckId}).then((res) => {
                        let deck = JSON.parse(res);
                        usage.forEach((usageItem) => {
                            if (usageItem.id === deckId) {
                                usageItem.title = deck.revisions.find((revision) => {
                                    return revision.id === usageItem.revision;
                                }).title;
                            }
                        });
                    }));
                });
                //when all deck data is fetched
                Promise.all(deckPromises).then(() => {
                    callback(null, {usage: usage, selector: selector});
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
