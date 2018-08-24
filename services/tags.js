import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'tags',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;

        switch (resource) {
            case 'tags.get':
                rp.get({
                    uri: `${Microservices.tag.uri}/tag/${args.tagName}`, 
                    json: true
                }).then((tag) => {
                    callback(null, tag);
                }).catch((err) => {
                    callback(err);
                });
                break;
        }
    }
};
