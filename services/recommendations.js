import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'recommendations',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let uid = args.uid;
        if (uid === undefined) {
            uid = 0;
        }
        if (resource === 'recommendations.list'){
            const minNoOfRecommendations = 6;

            const recommendationServiceUri = Microservices.analytics.uri;

            rp.get({uri: recommendationServiceUri + '/analytics/webresources/recommender?userid=' + uid, proxy: '' }).then((res) => {





                let recommendations = JSON.parse(res);

                //GET DATA FOR DECKS FROM DECK SERVICE
                let deckPromises = [];
                let likesPromises = [];//get the number of deck likes

                // get details for the decks in the collection
                for(let deck of recommendations){
                    let deckId = deck.deckid;
                    deckPromises.push(
                        rp.get({
                            uri: `${Microservices.deck.uri}/deck/${deckId}`,
                            json: true
                        })
                    );

                    likesPromises.push(
                        rp.get({
                            uri: Microservices.activities.uri + '/activities/deck/' + deckId + '?metaonly=true&activity_type=react&all_revisions=true'
                        })
                    );
                }
                let deckPromise = Promise.all(deckPromises);
                let likesPromise = Promise.all(likesPromises);

                Promise.all([deckPromise, likesPromise]).then( (data) => {
                    let decks = data[0];
                    let recommendationDecks = [];
                    for (let i = 0; i < data[1].length; i++) {
                        let recommendationDeck = decks[i];
                        if (recommendationDeck.user !== uid) {// do not recommend decks owned by the user
                            recommendationDeck.noOfLikes = data[1][i];
                            recommendationDeck.recommendationWeight = recommendations[i].weight;
                            recommendationDecks.push(recommendationDeck);
                        }
                    }

                    const noOfRecommendations = recommendationDecks.length;
                    if (noOfRecommendations >= minNoOfRecommendations) {
                        callback(null, {recommendations: recommendationDecks});
                    } else {
                        //GET SOME POPULAR decks
                        const numberOfDecks = minNoOfRecommendations - noOfRecommendations;

                        rp.get({uri: Microservices.activities.uri + '/activities/maxCount' +
                            '?activity_type=react&activity_type=download' + // GET DECKS WITH MAX NUMBER OF LIKES AND DOWNLOADS
                            '&all_revisions=true&limit=' + numberOfDecks + '&content_kind=deck' }).then((res) => {
                                let items = JSON.parse(res);

                                //GET DATA FOR DECKS FROM DECK SERVICE
                                let deckPromises2 = [];
                                let likesPromises2 = [];//get the number of deck likes

                                // get details for the decks in the collection
                                for(let item of items){
                                    let deckId = item._id.content_id;

                                    deckPromises2.push(
                                        rp.get({
                                            uri: `${Microservices.deck.uri}/deck/${deckId}`,
                                            json: true
                                        })
                                    );

                                    likesPromises2.push(
                                        rp.get({
                                            uri: Microservices.activities.uri + '/activities/deck/' + deckId + '?metaonly=true&activity_type=react&all_revisions=true'
                                        })
                                    );
                                }
                                let deckPromise2 = Promise.all(deckPromises2);
                                let likesPromise2 = Promise.all(likesPromises2);

                                Promise.all([deckPromise2, likesPromise2]).then( (data) => {
                                    let decks = data[0];

                                    for (let i = 0; i < data[1].length; i++) {
                                        let recommendationDeck = decks[i];
                                        if (recommendationDeck.user !== uid) {// do not recommend decks owned by the user
                                            recommendationDeck.noOfLikes = data[1][i];
                                            recommendationDeck.recommendationWeight = items[i].count / 1000;
                                            recommendationDecks.push(recommendationDeck);
                                        }
                                    }

                                    callback(null, {recommendations: recommendationDecks});
                                }).catch((err) => {
                                    console.log(err);
                                    callback(null, {recommendations: []});
                                });

                            }).catch((err) => {
                                console.log(err);
                                callback(null, {recommendations: []});
                            });
                    }
                }).catch( (err) => {
                    console.log(err);
                    callback(null, {recommendations: []});
                });
            }).catch((err) => {
                console.log(err);
                callback(null, {recommendations: []});
            });
        }
    }

    // other methods
    // create: (req, resource, params, body, config, callback) => {},

};
