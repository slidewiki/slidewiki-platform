import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;


export default {
    name: 'deckgroups',

    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;

        rp({
            method: 'GET', 
            uri: `${Microservices.deck.uri}/groups?user=${args.userId}&page=0&per_page=100`,
            json: true 
        }).then( (deckGroups) => callback(null, deckGroups))
        .catch( (err) => callback(err));
    }, 

    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params? params.params : params;

        rp({
            method: 'POST',
            uri: `${Microservices.deck.uri}/groups`,
            json: true,
            headers: {'----jwt----': args.jwt},
            body: {
                title: args.title, 
                description: args.description, 
                decks: []
            }
        }).then((deckGroup) => callback(null, deckGroup))
        .catch((err) => callback(err));
    },

    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        
        if(resource === 'deckgroups.replaceDecks'){

        }
    }
};
