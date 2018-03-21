import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

const analyticsServiceUri = 'http://localhost';



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




            rp.get({uri: analyticsServiceUri + '/analytics/webresources/predictionjob/' + uid, proxy: '' }).then((res) => {




                let predictions = JSON.parse(res);
                //GET DATA FOR DECKS FROM DECK SERVICE
                let deckPromises = [];
                // let likesPromises = [];//get the number of deck likes

                // get details for the decks in the collection
                for(let prediction of predictions){
                    let deckId = prediction.deckId;
                    deckPromises.push(
                        rp.get({
                            uri: `${Microservices.deck.uri}/deck/${deckId}`,
                            json: true
                        })
                    );

                    // likesPromises.push(
                    //     rp.get({
                    //         uri: Microservices.activities.uri + '/activities/deck/' + deckId + '?metaonly=true&activity_type=react&all_revisions=true'
                    //     })
                    // );
                }
                // let deckPromise = Promise.all(deckPromises);
                // let likesPromise = Promise.all(likesPromises);

                // Promise.all([deckPromise, likesPromise]).then( (data) => {
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
        let uid = args.prediction.userId;
        if (uid === undefined) {
            uid = 0;
        }

        if(resource === 'analytics.prediction'){
            rp.post({
                uri: analyticsServiceUri + '/analytics/webresources/predictionjob/',
                proxy: '',
                body:JSON.stringify({
                    user_id: uid,
                    deck_id: deckId
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
    }
};
