import { Microservices } from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'usergroup',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        // console.log('service usergroup with parameters',resource,  params, config);
        let args = params.params ? params.params : params;

        // user groups owned by the specified user
        if(resource === 'usergroup.member'){
            rp({
                method: 'GET',
                uri: Microservices.user.uri + '/user/' + args.userId + '/profile',
                headers: { '----jwt----': args.jwt },
                json: true
            }).then( (response) => callback(null, response.groups))
            .catch( (err) => callback(err));
        } else if (resource === 'usergroup.getList') {
            // console.log('service usergroup try to get group with id', params.groupid);
            rp.post({
                uri: Microservices.user.uri + '/usergroups',
                body: params.groupids,
                json: true
            })
            .then((res) => {
                // console.log('Service got usergroups:', res);
                callback(null, res);
            })
            .catch((err) => {
                // console.warn('Error', err);
                callback(err, null);
            });
        } else {
            // usergroup.read got here
            // console.log('service usergroup try to get group with id', params.groupid);
            rp.post({
                uri: Microservices.user.uri + '/usergroups',
                body: [parseInt(params.groupid)],
                json: true
            })
            .then((res) => {
                // console.log('Service got usergroups:', res);
                callback(null, res);
            })
            .catch((err) => {
                // console.warn('Error', err);
                callback(err, null);
            });
        }
    }
};
