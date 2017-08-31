import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'discussion',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype, 'mode': args.mode};

        const content_kind = selector.stype;
        const content_id = selector.sid;
        if(resource === 'discussion.list'){
            /*********connect to microservices*************/
            rp.get({uri: Microservices.discussion.uri + '/discussion/' + content_kind + '/' + content_id + '?metaonly=false'}).then((res) => {
                callback(null, {discussion: JSON.parse(res).items, selector: selector});
            }).catch((err) => {
                // console.log(err);
                callback(err, {discussion: [], selector: selector});
            });
        } else if(resource === 'discussion.count'){
            rp.get({uri: Microservices.discussion.uri + '/discussion/' + content_kind + '/' + content_id + '?metaonly=true'}).then((res) => {
                callback(null, {count: JSON.parse(res).count, selector: selector});
            }).catch((err) => {
                console.log('Error while getting discussion count of deck:', err.StatusCodeError, err.message, err.options);
                callback(null, {count: 0, selector: selector});
            });
        }
    },

    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params? params.params : params;
        let selector= args.selector;
        if(resource === 'discussion.comment'){
            const content_id = selector.sid;
            rp.post({
                uri: Microservices.discussion.uri + '/comment/new',
                body:JSON.stringify({
                    title: args.title,
                    text: args.text,
                    user_id: String(args.userid),
                    content_id: content_id,
                    content_kind: selector.stype
                })
            }).then((res) => {
                callback(null, {comment: JSON.parse(res), selector: args.selector});
            }).catch((err) => {
                console.log(err);
                callback(err, {comment: {}, selector: args.selector});
            });
        }

        if(resource === 'discussion.reply'){
            rp.post({
                uri: Microservices.discussion.uri + '/comment/new',
                body:JSON.stringify({
                    title: args.title,
                    text: args.text,
                    user_id: String(args.userid),
                    content_id: args.comment.content_id,
                    content_kind: args.comment.content_kind,
                    parent_comment: args.comment.id
                })
            }).then((res) => {
                callback(null, {comment: JSON.parse(res), selector: args.selector});
            }).catch((err) => {
                console.log(err);
                callback(err, {comment: {}, selector: args.selector});
            });
        }
    }
    // other methods
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
