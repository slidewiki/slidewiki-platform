// import _ from 'lodash';
import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'following',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= args.selector;
        let userId = args.userId;
        const content_kind = selector.stype;
        let targetDeckID;
        if (selector.stype === 'deck') {
            targetDeckID = selector.sid;
        } else if (selector.stype === 'slide') {
            let tmp = selector.spath.split(';');
            if (tmp.length > 1) {
                targetDeckID = tmp[tmp.length - 2];
                tmp = targetDeckID.split(':');
                targetDeckID = tmp[0];
            } else {
                targetDeckID = selector.id;
            }
        }
        targetDeckID =  targetDeckID.split('-')[0];
        switch (resource) {
            case 'following.item':
                rp.get({uri: Microservices.activities.uri + '/followings/follower/' + userId + '?followed_type=deck&followed_id=' + targetDeckID }).then((res) => {
                    let followings = JSON.parse(res);
                    callback(null, {followings: followings});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {followings: []});
                });
                break;
        }
    },
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= args.selector;
        let userId = args.userId;
        let targetDeckID;

        switch (resource) {
            case 'following.new':
                if (selector.stype === 'deck') {
                    targetDeckID = selector.sid;
                } else if (selector.stype === 'slide') {
                    let tmp = selector.spath.split(';');
                    if (tmp.length > 1) {
                        targetDeckID = tmp[tmp.length - 2];
                        tmp = targetDeckID.split(':');
                        targetDeckID = tmp[0];
                    } else {
                        targetDeckID = selector.id;
                    }
                }
                targetDeckID =  targetDeckID.split('-')[0];

                let headers = {};
                if (args.jwt) headers['----jwt----'] = args.jwt;

                rp.post({
                    uri: Microservices.activities.uri + '/followings/new',
                    body:JSON.stringify({
                        user_id: String(userId),
                        followed_type: 'deck',
                        followed_id: String(targetDeckID)
                    }),
                    headers,
                }).then((res) => {
                    callback(null, JSON.parse(res));
                }).catch((err) => {
                    console.log(err);
                    callback(null, {id: null});
                });
                //callback(null, {userid:  params.userid});
                break;

        }
    },
    delete: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'delete', Method: req.method});
        let args = params.params? params.params : params;

        if (resource === 'following.item'){
            /*********connect to microservices*************/
            const id = args.id;
            let options = {
                method: 'DELETE',
                uri: Microservices.activities.uri + '/followings/delete',
                body:JSON.stringify({
                    id: id
                })
            };
            rp(options).then(() => {
                callback(null, {id: id});
            }).catch((err) => {
                console.log(err);
                callback(err, params);
            });
        }
    },

    // other methods
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
