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
            console.log('selector: ', selector, '\nargs: ', args, '\nid: ', id, 'isSubdeck: ', isSubdeck, '\n\n');

            rp.get({uri: Microservices.deck.uri + '/deck/' + String(id) + '/slides'}).then((res) => {
                slideServiceRes = JSON.parse(res);
                callback(null, {content: slideServiceRes.children, theme: slideServiceRes.theme, selector: selector});

            }).catch((err) => {
                console.log('There was an error!', err);
                returnErr = true;
                callback(null, {content: slideServiceRes, theme: theme, selector: selector});
            });
        }//If presentation.content
    }
};

function get_sample_theme(){
    let themes = ['beige', 'black', 'blood', 'league', 'moon', 'night', 'serif', 'simple', 'sky', 'solarized', 'white'];
    let index = Math.floor(Math.random() * (themes.length - 1));
    // Just hardcode this for now.  Change to themes[index] if we really want it random.
    //return themes[0];
    return themes[12];
}
