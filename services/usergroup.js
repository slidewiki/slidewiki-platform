import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'usergroup',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        // console.log('service usergroup with parameters',resource,  params, config);

        // user groups owned by the specified user
        if(resource === 'usergroup.member'){
            rp({
                method: 'GET',
                uri: Microservices.user.uri + '/user/' + params.userId + '/profile',
                headers: { '----jwt----': params.jwt },
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
