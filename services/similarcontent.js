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
            let serviceUri = Microservices.recommender.uri;
            console.log('DEBUG similarContent');
            console.log(params);
            let userId = params.userid?params.userid :args.userid;
            if(userId){ //user logged
                serviceUri= serviceUri+'/deckUserRecommendation/'+args.sid+'?user_id='+userId+'&numberReco='+numberReco;
                console.log('Hay usuario');
                console.log(serviceUri);
            }else{
                serviceUri= serviceUri+'/deckRecommendation/'+args.sid+'?numberReco='+numberReco;
                console.log('No hay');
                console.log(serviceUri);
            }

            console.log(serviceUri);
            rp.get({uri: serviceUri}).then((res) => {

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
