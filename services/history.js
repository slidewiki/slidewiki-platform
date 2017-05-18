import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import TreeUtil from '../components/Deck/TreePanel/util/TreeUtil';
const log = require('../configs/log').log;

export default {
    name: 'history',

    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        let selector = {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        if (resource === 'history.changes') {
            let changes;
            let changesPromise = selector.stype === 'deck'? rp.get({uri: Microservices.deck.uri + '/deck/' + selector.sid.split('-')[0] + '/changes'}) :
                rp.get({uri: Microservices.deck.uri + '/slide/' + selector.sid.split('-')[0] + '/changes', qs:{root: selector.id.split('-')[0]}});
            changesPromise.then((res) => {
                changes = JSON.parse(res);
                //find unique user ids in change log
                let userIds = [... new Set(changes.map((changeOp) => changeOp.user))];
                return rp.post({uri: Microservices.user.uri + '/users', body: JSON.stringify(userIds)});
            }).then((usersRes) => {
                let users = JSON.parse(usersRes);
                let usersById = {};
                users.forEach((user) => usersById[user._id] = user);
                changes.forEach((changeOp) => {
                    changeOp.username = usersById[changeOp.user].username;
                });
                callback(null, {
                    changes: changes,
                    selector: selector
                });
            }).catch((err) => callback(err));
            //returns the number of revisions of a deck
        } else if (resource === 'history.revisionCount'){
            rp.get({uri: Microservices.deck.uri + '/deck/' + selector.sid + '/revisionCount/'}).then((res) => {
                callback(null, {count: JSON.parse(res), selector: selector});
            }).catch((err) => {
                //console.log(err);
                callback({msg: 'Error in retrieving revisions count', content: err}, {});
            });
            //returns the revisions of a deck
        } else if (resource === 'history.revisions') {
            let revisions;
            rp.get({uri: Microservices.deck.uri + '/deck/' + args.id.split('-')[0] + '/revisions'}).then((res) => {
                revisions = JSON.parse(res);
                //find unique user ids in revisions
                let userIds = [... new Set(revisions.map((rev) => rev.user))];
                return rp.post({uri: Microservices.user.uri + '/users', body: JSON.stringify(userIds)});
            }).then((usersRes) => {
                let users = JSON.parse(usersRes);
                let usersById = {};
                users.forEach((user) => usersById[user._id] = user);
                revisions.forEach((rev) => {
                    rev.username = usersById[rev.user].username;
                });
                callback(null, {
                    revisions: revisions,
                    selector: selector
                });
            }).catch((err) => callback(err));
        }
    },
    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        let args = params.params ? params.params : params;
        if (resource === 'history.revert') {
            let parentId = TreeUtil.getParentId(args.selector);
            let requestBody = {
                revision_id: String(args.revisionId)
            };
            if (parentId != null) {
                requestBody.root_deck = parentId;
            }
            requestBody.top_root_deck = args.selector.id;
            rp.post({
                uri: Microservices.deck.uri + '/' + args.selector.stype + '/revert/' + args.selector.sid.split('-')[0],
                body: JSON.stringify(requestBody),
                headers: { '----jwt----': args.jwt }
            }).then((res) => {
                callback(null, JSON.parse(res));
            }).catch((err) => {
                console.log(err);
                callback(err, {
                    error: err
                });
            });
        }
    }
};
