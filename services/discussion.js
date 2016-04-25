import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'discussion',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {

        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype, 'mode': args.mode};
        if(resource === 'discussion.list'){
            /*********connect to microservices*************/
            // rp.get({uri: Microservices.discussion.uri + '/discussion/' + selector.stype + '/' + selector.id}).then((res) => {
            rp.get({uri: Microservices.discussion.uri + '/discussion/' + selector.sid}).then((res) => {
                callback(null, {discussion: JSON.parse(res), selector: selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {discussion: {}, selector: selector});
            });
        }

    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
