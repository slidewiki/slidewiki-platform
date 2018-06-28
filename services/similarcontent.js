import {log} from '../configs/log';
import rp from 'request-promise';
import {Microservices} from '../configs/microservices';


export default {
    name: 'similarcontent',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'sid': args.sid, 'stype': args.stype};
        if(resource === 'similarcontent.list'){
            /*********connect to microservices*************/
            //NLP SIMILAR CONTENT
            //nlp service:https://nlpservice.experimental.slidewiki.org/nlp/deckRecommendationSimilarDecks/?deckId=1&maxRecommendationsToReturn=10&maxCandidatesToUseForSimilarityCalculation=30&tfidfMaxTermsToConsider=10&performLiveTFIDFCalculationOfGivenDeck=true&performLiveTFIDFCalculationOfDeckCandidates=true&performTitleBoost=true&titleBoostWithFixedFactor=-1&titleBoostlimitToFrequencyOfMostFrequentWord=true&minFrequencyOfTermOrEntityToBeConsidered=2&applyMinFrequencyOfTermOnlyAfterTitleBoost=true&minCharLength=3&maxNumberOfWords=4&tfidfMinDocsToPerformLanguageDependent=100

            let maxRecommendations = 5;
            let simContNLPservice = Microservices.nlp.uri + '/nlp/deckRecommendationSimilarDecks/?deckId=' + args.sid+
              '&maxRecommendationsToReturn='+maxRecommendations+
              '&maxCandidatesToUseForSimilarityCalculation=30'+
              '&tfidfMaxTermsToConsider=10'+
              '&performLiveTFIDFCalculationOfGivenDeck=true'+
              '&performLiveTFIDFCalculationOfDeckCandidates=true'+
              '&performTitleBoost=true'+
              '&titleBoostWithFixedFactor=-1'+
              '&titleBoostlimitToFrequencyOfMostFrequentWord=true'+
              '&minFrequencyOfTermOrEntityToBeConsidered=2'+
              '&applyMinFrequencyOfTermOnlyAfterTitleBoost=true'+
              '&minCharLength=3'+
              '&maxNumberOfWords=4'+
              '&tfidfMinDocsToPerformLanguageDependent=100';





            rp.get({uri: simContNLPservice}).then((res) => {
              //Retrieve deck details
                let recommendation = JSON.parse(res);

                let recDecks = recommendation.items;

                //GET DATA FOR DECKS FROM DECK SERVICE
                let deckPromises = [];
                let decksDetails = [];
                let likesPromises = [];//get the number of deck likes
                // get details for the decks
                for(let deck of recDecks){
                    rp.get({
                        uri: Microservices.deck.uri+'/deck/'+deck.deckId,
                        json: true
                    }).then((res) => {
                        deckDetails.push(JSON.parse(res));
                        console.log(deckDetails);                       

                    }).catch((err) => { //error, no results
                        callback(err, []);
                    });

              /*      console.log('likes call');
                    console.log(Microservices.activities.uri + '/activities/deck/' + deck.deckId + '?metaonly=true&activity_type=react&all_revisions=true');

                    likesPromises.push(
                          rp.get({
                              uri: Microservices.activities.uri + '/activities/deck/' + deck.deckId + '?metaonly=true&activity_type=react&all_revisions=true'
                          }).catch((err) => { //error, no results
                              callback(err, []);
                          })
                      );
*/
                }
  //              Promise.all([likesPromises]).tap( console.log);

                /*
                Promise.all([likesPromises]).then( (deckLikes) => {
                    console.log('Data collected likes');
                    console.log(JSON.parse(deckLikes));
                });
*/
                let userPromises = [];
                let deckPromise = Promise.all(deckPromises).then((decksDetails) => {
                    console.log('Deck details');
                    console.log(decksDetails);

                    for(let deck of decksDetails){
                      //retrieve users details
                        userPromises.push(
                            rp.get({
                                uri: Microservices.user.uri+'/user/'+deck.user
                            }).catch((err) => { //error, no results
                                callback(err, []);
                            })
                          );
                    }

                    let uP = Promise.all([userPromises]).then((recDeckUsers) => {
                        console.log('Data collected users');
                        console.log(recDeckUsers);

                    });

                });

              //Build the final response



                let contents = [
                    {'deckId': '718', 'title': 'final test' , 'firstSlideId': '6398', 'author': 'txwkx' , 'authorId':'47' , 'date':'27/01/2017' ,'liked': '0', 'downloaded': '0'},
                    {'deckId': '617', 'title': 'Usability 3', 'firstSlideId': '5144','author': 'abijames1', 'authorId':'6' , 'date':'20/01/2017' ,'liked': '1', 'downloaded': '0'},
                    {'deckId': '2249', 'title': 'Usability', 'firstSlideId': '14738','author': 'dpaun', 'authorId':'16' , 'date':'22/08/2017' ,'liked': '0', 'downloaded': '0'}
                ];
                callback(null, {contents: contents, selector: selector});

            }).catch((err) => { //error, no results
                callback(err, []);
            });

            //deckservice

            //likes: https://activitiesservice.experimental.slidewiki.org/activities/deck/3951?metaonly=true&activity_type=react&all_revisions=true
            //download: https://activitiesservice.experimental.slidewiki.org/activities/deck/3951?metaonly=true&activity_type=download&all_revisions=true
            //user https://userservice.experimental.slidewiki.org/user/16


            /*********received data from microservices*************/
            /*
            let contents = [
                {'deckId': '718', 'title': 'final test' , 'firstSlideId': '6398', 'author': 'txwkx' , 'authorId':'47' , 'date':'27/01/2017' ,'liked': '0', 'downloaded': '0'},
                {'deckId': '617', 'title': 'Usability 3', 'firstSlideId': '5144','author': 'abijames1', 'authorId':'6' , 'date':'20/01/2017' ,'liked': '1', 'downloaded': '0'},
                {'deckId': '2249', 'title': 'Usability', 'firstSlideId': '14738','author': 'dpaun', 'authorId':'16' , 'date':'22/08/2017' ,'liked': '0', 'downloaded': '0'}
            ];
            callback(null, {contents: contents, selector: selector});*/
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
