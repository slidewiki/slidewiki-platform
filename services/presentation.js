import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'presentation',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector = {
            'id': args.id, 'subdeck': args.subdeck, 'sid': args.sid

        };
        let presentation = [];
        if(resource === 'presentation.content'){
            /*********connect to microservices*************/
            let returnErr = false;
            let slideServiceRes;
            //let theme = get_sample_theme();
            let isSubdeck = selector.id !== selector.subdeck;
            let id = isSubdeck ? selector.subdeck : selector.id;
            console.log( Microservices.deck.uri + '/deck/' + String(id) + '/slides');

            rp.get({uri: Microservices.deck.uri + '/deck/' + String(id) + '/slides'}).then((res) => {
                slideServiceRes = JSON.parse(res);
                callback(null, {content: slideServiceRes.children, theme: slideServiceRes.theme, selector: selector});

            }).catch((err) => {
                returnErr = true;
                callback(null, {content: slideServiceRes, theme: undefined, selector: selector});
            });
        }//If presentation.content
        else if(resource === 'presentation.live'){
            rp.get({uri: Microservices.webrtc.uri + '/rooms/' + String(args.id)}).then((res) => {
                // console.log('presentation.live returned', res);
                callback(null, JSON.parse(res));
            }).catch((err) => {
                // console.log('Error:', err);
                callback(err);
            });
        }
    }
};
