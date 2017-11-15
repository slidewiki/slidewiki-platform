import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'translation',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        if(resource === 'translation.list'){

            let deck_id = parseInt(args.sid.split('-')[0]);
            let translations = [];
            let currentLang = {};
            rp({
                method: 'GET',
                json: true,
                uri: Microservices.deck.uri + '/deck/' + deck_id + '/translations',
            }).then((res) => {
                callback(null, res);
            }).catch((err) => {
                callback(err, {translations: [], currentLang: currentLang});
            });
        }
        if (resource === 'translation.supported'){
            rp.get({uri: Microservices.translation.uri + '/supported'}).then((res) => {
                callback(null, {supportedLangs: JSON.parse(res)});
            }).catch((err) => {
                callback(err, {supportedLangs: []});
            });
            // let supportedLangs = [];
            // supportedLangs = [
            //     {'language':'Afrikan', 'code':'af'},
            //     {'language':'Russian', 'code':'ru'}
            // ];
            // callback(null, {supportedLangs: supportedLangs});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
