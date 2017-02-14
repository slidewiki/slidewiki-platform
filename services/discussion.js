import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'discussion',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {

        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype, 'mode': args.mode};

        // const content_id = (!selector.sid.startsWith('1122334455')) ? ('112233445566778899000000'.substring(0, 24 - selector.sid.length) + selector.sid) : selector.sid;//TODO solve these ID issues
        const content_kind = selector.stype;
        const content_id = selector.sid;
        if(resource === 'discussion.list'){
            /*********connect to microservices*************/
            rp.get({uri: Microservices.discussion.uri + '/discussion/' + content_kind + '/' + content_id}).then((res) => {
                callback(null, {discussion: JSON.parse(res), selector: selector});
            }).catch((err) => {
                // console.log(err);
                callback(err, {discussion: [], selector: selector});
            });
        } else if(resource === 'discussion.count'){
            rp.get({uri: Microservices.discussion.uri + '/discussion/count/' + content_kind + '/' + content_id}).then((res) => {
                callback(null, {count: res, selector: selector});
            }).catch((err) => {
                console.log('Error while getting discussion count of deck:', err.StatusCodeError, err.message, err.options);
                callback(null, {count: 0, selector: selector});
            });
        }
    },

    create: (req, resource, params, body, config, callback) => {
        let args = params.params? params.params : params;
        let selector= args.selector;
        if(resource === 'discussion.comment'){
            // const content_id = (!selector.sid.startsWith('1122334455')) ? ('112233445566778899000000'.substring(0, 24 - selector.sid.length) + selector.sid) : selector.sid;
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
