import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'suggester',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params ? params.params : params;

        if(resource === 'suggester.users'){
            rp.get({uri: Microservices.search.uri + '/suggest/users/' + args.query}).then((res) => {
                // console.log('From service:', res);
                callback(null, {
                    success: true,
                    results: JSON.parse(res).docs
                });
            }).catch((err) => {
                console.log(err);
                callback(null, {success: false, results: {}});
            });
        }
    }
};
