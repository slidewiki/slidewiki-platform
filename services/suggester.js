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

        switch (resource) {
            case 'suggester.users':
                rp.get({uri: `${Microservices.search.uri}/suggest/users?q=${args.query}`}).then((res) => {
                    callback(null, { success: true, results: JSON.parse(res).response.docs });
                }).catch((err) => {
                    callback(null, {success: false, results: {}});
                });
                break;
            case 'suggester.keywords':
                rp.get({uri: `${Microservices.search.uri}/suggest/keywords?q=${args.query}`}).then((res) => {
                    callback(null, { success: true, results: JSON.parse(res).response.docs });
                }).catch((err) => {
                    callback(null, {success: false, results: {}});
                });
                break;
            case 'suggester.tags':
                rp.get({uri: `${Microservices.tag.uri}/tag/suggest/${args.query}`}).then((res) => {
                    callback(null, { success: true, results: JSON.parse(res) });
                }).catch((err) => {
                    callback(null, {success: false, results: {}});
                });
                break;
        }
    }
};
