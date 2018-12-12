import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'userlti',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        // console.log('service usergroup with parameters',resource,  params, config);
        let args = params.params ? params.params : params;

        // user groups owned by the specified user
        if(resource === 'userlti.member'){
            rp({
                method: 'GET',
                uri: Microservices.user.uri + '/user/' + args.userId + '/profile',
                headers: { '----jwt----': args.jwt },
                json: true
            }).then( (response) => callback(null, response.ltis))
            .catch( (err) => callback(err));
        } else {
            // usergroup.read got here
            rp.post({
                uri: Microservices.user.uri + '/userltis',
                body: [params.ltiid],
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
