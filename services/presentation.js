import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'presentation',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        // console.log('req:', req, '\n\n');
        // console.log('resource': resource, '\n\n');
        // console.log('params', params);

        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        // console.log('args', args);
        let selector= {'id': args.id, 'subdeck': args.subdeck, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        //Load the whole presentation
        let presentation = [];
        if(resource === 'presentation.content'){
            /*********connect to microservices*************/
            let returnErr = false;

            let id = args.subdeck ? args.subdeck : args.id;
            let isSubdeck = (id === args.subdeck);
            // let subdeck = args.subdeck;
            let slideServiceRes;
            let nextDeck = '';
            // Get the full structure of the deck first

            let uri = Microservices.deck.uri + '/deck/' + String(id) + '/slides';
            rp.get({uri: uri}).then((res) => {
                let slideServiceRes = JSON.parse(res);
                if(isSubdeck){
                    // Find the next one in the list (if it exists)
                    rp.get(Microservices.deck.uri + '/deck/' + String(args.id)).then((res) => {
                        // slideServiceRes = JSON.parse(res);
                        // let next = false;
                        // for(s in slideServiceRes.revisions[0].contentItems){
                        //     if(next){
                        //
                        //     }
                        //     if(s.id === id){
                        //
                        //     }
                        // }
                        callback(null, {content: slideServiceRes.children, theme: slideServiceRes.theme, selector: selector});
                    }).catch((err) => {
                        console.log('There was an error!', err);
                        returnErr = true;
                        callback(null, {content: slideServiceRes, theme: theme, selector: selector});

                    });

                }
                else{
                    callback(null, {content: slideServiceRes.children, theme: slideServiceRes.theme, selector: selector});
                }
            }).catch((err) => {
                console.log('There was an error!', err);
                returnErr = true;
                callback(null, {content: slideServiceRes, theme: theme, selector: selector});

            });


            // return rp.get().then((res) => {
            //     slideServiceRes = JSON.parse(res);
            //     // console.log('slideServiceRes', res);
            //
            //
            // }).catch((err) => {
            // });

        }//If presentation.content
    },

    getSlides: (id, isSubdeck) => {

    }
};

function getSlides(args){
  // This function will check which set of slides we want
  //Algorithm will work as follows:
  /*
  1. If there is a slide ID, check if the parent deck is the same as root deck
  2. If there is a deck ID, iterate through contentItems to see if there is a deck
    2a. If yes, load presentation from start until the end of the deck
    2b. If no, load the whole deck
  */
    // if(args.stype === 'slide'){

}

function get_sample_theme(){
    let themes = ['beige', 'black', 'blood', 'league', 'moon', 'night', 'serif', 'simple', 'sky', 'solarized', 'white'];
    let index = Math.floor(Math.random() * (themes.length - 1));
    // Just hardcode this for now.  Change to themes[index] if we really want it random.
    //return themes[0];
    return themes[12];
}
