import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

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
                callback(null, {usage: activeRevision.usage, selector: selector});
            }).catch((err) => {
                callback(err);
            });
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
