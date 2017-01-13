import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'usergroup',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        // console.log('service usergroup with parameters',resource,  params, config);
        rp.post({
            uri: Microservices.user.uri + '/usergroups',
            body: [params.groupid],
            json: true
        })
            .then((res) => {
                console.log('Got usergroups:', res);
                callback(null, res);
            })
            .catch((err) => {
                callback(err,null);
            });
    }
};
