import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'discussion',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {

        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype, 'mode': args.mode};

        // const content_id = (!selector.sid.startsWith('1122334455')) ? ('112233445566778899000000'.substring(0, 24 - selector.sid.length) + selector.sid) : selector.sid;//TODO solve these ID issues
        const content_id = selector.sid;
        if(resource === 'discussion.list'){
            /*********connect to microservices*************/
            // rp.get({uri: Microservices.discussion.uri + '/discussion/' + selector.stype + '/' + selector.id}).then((res) => {
            rp.get({uri: Microservices.discussion.uri + '/discussion/' + content_id}).then((res) => {
                callback(null, {discussion: JSON.parse(res), selector: selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {discussion: {}, selector: selector});
            });
        }

    },

    create: (req, resource, params, body, config, callback) => {
        //TODO get the real user id
        const randomUserId = '11223344556677889900000' + String(1 + Math.round(Math.random() * 5));

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
                    user_id: randomUserId,
                    content_id: content_id,
                    content_kind: selector.stype
                })
            }).then((res) => {
                callback(null, {comment: JSON.parse(res), selector: args.selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {comment: {}, selector: args.selector});
            });
        }

        if(resource === 'discussion.reply'){
            rp.post({
                uri: Microservices.discussion.uri + '/comment/new',
                body:JSON.stringify({
                    title: args.title,
                    text: args.text,
                    user_id: randomUserId,
                    content_id: args.comment.content_id,
                    content_kind: args.comment.content_kind,
                    parent_comment: args.comment.id
                })
            }).then((res) => {
                callback(null, {comment: JSON.parse(res), selector: args.selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {comment: {}, selector: args.selector});
            });
        }

    }
    // other methods
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
