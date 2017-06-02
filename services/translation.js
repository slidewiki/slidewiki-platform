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
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let translations = [];

            if(args.sid%2===0){
                translations=[
            	                {'lang': 'EN', 'id': 343},
            	                {'lang': 'DE', 'id': 32},
            	                {'lang': 'FR', 'id': 64}
                ];
            }
            else{
                translations = [
                              {'lang': 'EN', 'id': 343},
            	                {'lang': 'ES', 'id': 56},
            	                {'lang': 'GR', 'id': 71},
            	                {'lang': 'FA', 'id': 81}
                ];
            }



            let currentLang = {'lang': 'EN', 'id': 343};
            callback(null, {translations: translations, currentLang: currentLang});
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
