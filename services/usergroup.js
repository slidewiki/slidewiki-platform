import { Microservices } from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'usergroup',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
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
        } else {
            // usergroup.read got here
            rp.post({
                uri: Microservices.user.uri + '/usergroups',
                body: [params.groupid],
                json: true
            })
            .then((res) => {
                // console.log('Got usergroups:', res);
                callback(null, res);
            })
            .catch((err) => {
                callback(err,null);
            });
        }

    }
};
