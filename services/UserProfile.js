import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'userProfile',

    delete: (req, resource, params, body, config, callback) => {
        console.log('Remove User from service');
        let args = params.params ? params.params : params;
        rp.get({
            uri: 'http://localhost:8000',
            headers: {'custom_header':'123456'},
            resolveWithFullResponse: true
        }).then((res) => {
            console.log( res );
            callback(null,{a:1});
        });
    }
};
