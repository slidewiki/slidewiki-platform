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
            let numberReco = 5; //Number of recommendations to be retrieved from the service
            console.log('similarcontent.list:'+Microservices.recommender.uri+'/deckRecommendation/'+args.sid+'?numberReco='+numberReco);
            rp.get({uri: Microservices.recommender.uri+'/deckRecommendation/'+args.sid+'?numberReco='+numberReco}).then((res) => {

                let recommendations = JSON.parse(res);
                let contents = [];
                for(let deck of recommendations){
                    contents.push({
                        'deckId': deck.id,
                        'title': deck.title,
                        'firstSlideId': deck.firstSlide,   //TODO deck.firstSlide,
                        'author': deck.author, //TODO deck.displayName,
                        'authorId': deck.authorId, //TODO deck.authorId,
                        'date': deck.date , //TODO deck.date
                        'liked': deck.likes, //TODO deck.likes
                        'downloaded': deck.downloads //TODO deck.downloads
                    });
                }

              //Build the final response
/* For testing
                let contents = [
                    {'deckId': '718', 'title': 'final test' , 'firstSlideId': '6398', 'author': 'txwkx' , 'authorId':'47' , 'date':'27/01/2017' ,'liked': '0', 'downloaded': '0'},
                    {'deckId': '617', 'title': 'Usability 3', 'firstSlideId': '5144','author': 'abijames1', 'authorId':'6' , 'date':'20/01/2017' ,'liked': '1', 'downloaded': '0'},
                    {'deckId': '2249', 'title': 'Usability', 'firstSlideId': '14738','author': 'dpaun', 'authorId':'16' , 'date':'22/08/2017' ,'liked': '0', 'downloaded': '0'}
                ];
  */
                callback(null, {contents: contents, selector: selector});

            }).catch((err) => { //error, no results
                callback(err, []);
            });


        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
