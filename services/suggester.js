import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'suggester',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        let urlPrefix = '';

        switch (resource) {
            case 'suggester.users':
                urlPrefix = '/suggest/users';
                break;
            case 'suggester.keywords':
                urlPrefix = '/suggest/keywords';
                break;
        }

        rp.get({uri: Microservices.search.uri + urlPrefix + '?q=' + args.query}).then((res) => {

            callback(null, {
                success: true,
                results: JSON.parse(res).response.docs
            });
        }).catch((err) => {
            // console.log(err);
            callback(null, {success: false, results: {}});
        });
    }
};
