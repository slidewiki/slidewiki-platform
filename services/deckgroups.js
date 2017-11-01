import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;


export default {
    name: 'deckgroups',

    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;

        if(resource === 'deckgroups.user'){
            rp({
                method: 'GET', 
                uri: `${Microservices.deck.uri}/groups?user=${args.userId}&page=0&per_page=100`,
                json: true 
            }).then( (deckGroups) => callback(null, deckGroups))
            .catch( (err) => callback(err));
        } else if (resource === 'deckgroups.deck'){
            rp({
                method: 'GET', 
                uri: `${Microservices.deck.uri}/deck/${args.sid}/groups?user=${args.userId}`,
                json: true 
            }).then( (deckGroups) => callback(null, deckGroups))
            .catch( (err) => callback(err));
        }
        
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
        let args = params.params? params.params : params;

        // update deck assignments to deck groups
        if(resource === 'deckgroups.updateDeck'){
            console.log(args);

            // get deck groups assigned to current deck
            rp({
                method: 'GET', 
                uri: `${Microservices.deck.uri}/deck/${args.deckId}/groups`, 
                json: true
            }).then( (existingDeckGroups) => {
                let existingDeckGroupIds = existingDeckGroups.map( (e) => { return e._id; });
                let addToGroups = [];
                let removeFromGroups = existingDeckGroupIds;

                // check if deck group ids given are already related to this deck
                args.deckGroups.forEach( (deckGroupId) => {
                    if(existingDeckGroupIds.includes(deckGroupId)){
                        // deck is already related to this deck group
                        removeFromGroups = removeFromGroups.filter( (e) => { return e !== deckGroupId; });
                    } else {
                        addToGroups.push(deckGroupId);
                    }
                });
            
                // let promises = [];
                // addToGroups.map( (groupId) => {
                    
                // });

                // console.log('add');
                // console.log(addToGroups);
                // console.log('remove');
                // console.log(removeFromGroups);
                callback(null, {});

            }).catch( (err) => callback);
        }
    }
};
