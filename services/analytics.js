import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'analytics',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let uid = args.uid;
        if (uid === undefined) {
            uid = 0;
        }
        if (resource === 'analytics.predictionslist'){

            rp.get({uri: Microservices.analytics.uri + '/analytics/webresources/predictionjob/' + uid, proxy: '' }).then((res) => {

                let predictions = JSON.parse(res);

                //GET DATA FOR DECKS FROM DECK SERVICE
                let deckPromises = [];
                for(let prediction of predictions){
                    let deckId = prediction.deckId;
                    deckPromises.push(
                        rp.get({
                            uri: `${Microservices.deck.uri}/deck/${deckId}`,
                            json: true
                        })
                    );
                }

                Promise.all(deckPromises).then( (data) => {
                    let decks = data;
                    for (let i = 0; i < decks.length; i++) {
                        let deck = decks[i];
                        // get the active revision of the deck
                        let activeRevision = deck.revisions[deck.revisions.length-1];
                        predictions[i].title = activeRevision.title;
                        predictions[i].deckFirstSlide = activeRevision.firstSlide;
                        predictions[i].deckTheme = activeRevision.theme;
                    }

                    callback(null, {predictions: predictions});
                }).catch( (err) => {
                    console.log(err);
                    callback(null, {predictions: []});
                });

            }).catch((err) => {
                console.log(err);
                callback(null, {predictions: []});
            });
        }
    },

    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params? params.params : params;
        let deckId = args.prediction.deckId;
        let dummy = args.prediction.useDummyData;
        let uid = args.prediction.userId;
        if (uid === undefined) {
            uid = 0;
        }

        if(resource === 'analytics.prediction'){
            rp.post({
                uri: Microservices.analytics.uri + '/analytics/webresources/predictionjob/',
                proxy: '',
                body:JSON.stringify({
                    user_id: uid,
                    deck_id: deckId,
                    jwt: args.jwt,
                    dummy: dummy
                }),
                timeout: body.timeout
            }).then((res) => {
                //LIST OF ALL PREDICTION JOBS RECEIVED
                let predictions = JSON.parse(res);
                //GET DATA FOR DECKS FROM DECK SERVICE
                let deckPromises = [];

                // get details for the decks in the collection
                for(let prediction of predictions){
                    let deckId = prediction.deckId;
                    deckPromises.push(
                        rp.get({
                            uri: `${Microservices.deck.uri}/deck/${deckId}`,
                            json: true,
                            timeout: body.timeout
                        })
                    );
                }

                Promise.all(deckPromises).then( (data) => {
                    let decks = data;
                    for (let i = 0; i < decks.length; i++) {
                        let deck = decks[i];
                        // get the active revision of the deck
                        let activeRevision = deck.revisions[deck.revisions.length-1];
                        predictions[i].title = activeRevision.title;
                        predictions[i].deckFirstSlide = activeRevision.firstSlide;
                        predictions[i].deckTheme = activeRevision.theme;
                    }
                    callback(null, {predictions: predictions});
                }).catch( (err) => {
                    console.log(err);
                    callback(null, {predictions: []});
                });
            }).catch((err) => {
                console.log(err);
                callback(err, {predictions: []});
            });
        }
    },

    delete: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params? params.params : params;
        let pid = args.predictionId;
        if (pid === undefined) {
            pid = 0;
        }

        if(resource === 'analytics.prediction'){
            let options = {
                method: 'DELETE',
                uri:  Microservices.analytics.uri + '/analytics/webresources/predictionjob/' + pid,
                // body:JSON.stringify({
                //     content_kind: 'deck',
                //     content_id: String(targetDeckID),
                //     activity_type: 'react',
                //     user_id: String(params.userid),
                //     all_revisions: true
                // })
            };
            rp(options).then((res) => {
                callback(null, {});
                // console.log('success', res);
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        }
    }
};
