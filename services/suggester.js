import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'suggester',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        log.info({id: req.id, service: __filename.split('/').pop(), resource: resource, operation: 'read', method: req.method});
        let args = params.params ? params.params : params;
        let urlPrefix = '';

        switch (resource) {
            case 'suggester.users':
                urlPrefix = '/suggest/users/';
                break;
            case 'suggester.keywords':
                urlPrefix = '/suggest/keywords/';
                break;
        }


        rp.get({uri: Microservices.search.uri + urlPrefix + args.query}).then((res) => {
            // console.log('From service:', res);
            callback(null, {
                success: true,
                results: JSON.parse(res).docs
            });
        }).catch((err) => {
            // console.log(err);
            callback(null, {success: false, results: {}});
        });
    }
};
