import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'translation',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        let selector = {'sid': args.sid, 'stype': args.stype, 'spath': args.spath};
        if(resource === 'translation.list'){
            let root_id = -1;
            if (args.id){
                root_id = parseInt(args.id.split('-')[0]);
            }
            let item_id = -1;
            let item_type = '';
            let translations = [];
            let currentLang = {};
            let result = {};

            rp({
                method: 'GET',
                json: true,
                uri: Microservices.deck.uri + '/' + 'deck' + '/' + root_id + '/translations',
            }).then((res) => {
                result.root = res;
                if (selector.sid && selector.stype && selector.spath){ //an item is selected
                    item_id = parseInt(args.sid.split('-')[0]);
                    item_type = selector.stype;
                    rp({
                        method: 'GET',
                        json: true,
                        uri: Microservices.deck.uri + '/' + item_type + '/' + item_id + '/translations',
                    }).then((res) => {
                        result.item = res;
                        callback(null, result);
                    }).catch((err) => {
                        callback(err, {translations: [], currentLang: currentLang});
                    });
                }else{ //root is selected
                    result.item = res;                    
                    callback(null, result);
                }
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
