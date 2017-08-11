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
        console.log('this ', this);
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
            // Get the full structure of the deck first
            let uri = Microservices.deck.uri + '/deck/' + String(id);
            // let limit, nextDeck = 0;

            // Check for subdecks
            rp.get({uri: uri}).then((res) => {
                slideServiceRes = JSON.parse(res);
                let afterDeck = getAfterDeck(slideServiceRes);
                // nextDeck = afterDeck.nextDeck;
                // limit = afterDeck.limit;

                if(afterDeck.limit > 0){ // There is a subdeck in this deck. We only load up to that subdeck, and link to it
                    rp.get(Microservices.deck.uri + '/deck/' + String(id) + '/slides?limit=' + String(afterDeck.limit)).then((limitedSlides) => {
                        limitedSlides = JSON.parse(limitedSlides);
                        // let nextDeckURL = '/Presentation/' + String(id) + '/' + String(nextDeck);
                        // let content = '<div class=\"pptx2html\" style=\"position: relative; width: 960px; height: 720px;\">'
                        // + '<h3>End of Subdeck</h3>'
                        // + '<p>The next deck is at <a href="' + nextDeckURL + '">' + nextDeckURL + '</a></p>'
                        // + '</div>';
                        // let nextSlide = {
                        //     'title': 'Next Subdeck',
                        //     'content': content,
                        //     'speakernotes': null,
                        //     'type': 'slide',
                        //     'id': 'next'
                        // };
                        // console.log('nextSlide: ', nextSlide);
                        limitedSlides.children.push(getAdditionalSlideObject(id, afterDeck.nextDeck));
                        callback(null, {content: limitedSlides.children, theme: limitedSlides.theme, selector: selector});
                    }).catch((err) => {
                        console.log('There was a limited error', err);
                    });
                }
                else{
                    console.log('We need to do some more stuff here');
                    if(isSubdeck){
                        // Check for whether there are any other decks or slides after the subdeck
                        rp.get({uri: Microservices.deck.uri + '/deck/' + String(args.id)}).then((afterSubdeck) => {
                            afterSubdeck = JSON.parse(afterSubdeck);
                            let nextSlide = getAdditionalSlideObject(args.id, id);
                            afterSubdeck.children.push(nextSlide);
                            callback(null, {content: afterSubdeck.children, theme: afterSubdeck.theme, selector: selector});
                        }).catch((err) => {
                            console.log('Error in the stuff after the subdeck', err);
                        });
                    }
                    else{
                        callback(null, {content: slideServiceRes.children, theme: slideServiceRes.theme, selector: selector});
                    }
                }
            }).catch((err) => {
                console.log('There was an error :-(', err);
            });

            // uri += '/slides';
            // rp.get({uri: uri}).then((res) => {
            //     let slideServiceRes = JSON.parse(res);
            //     if(isSubdeck){
            //         // Find the next one in the list (if it exists)
            //         rp.get(Microservices.deck.uri + '/deck/' + String(args.id)).then((res) => {
            //             // slideServiceRes = JSON.parse(res);
            //             // let next = false;
            //             // for(s in slideServiceRes.revisions[0].contentItems){
            //             //     if(next){
            //             //
            //             //     }
            //             //     if(s.id === id){
            //             //
            //             //     }
            //             // }
            //             callback(null, {content: slideServiceRes.children, theme: slideServiceRes.theme, selector: selector});
            //         }).catch((err) => {
            //             console.log('There was an error!', err);
            //             returnErr = true;
            //             callback(null, {content: slideServiceRes, theme: theme, selector: selector});
            //
            //         });
            //
            //     }
            //     else{
            //         callback(null, {content: slideServiceRes.children, theme: slideServiceRes.theme, selector: selector});
            //     }
            // }).catch((err) => {
            //     console.log('There was an error!', err);
            //     returnErr = true;
            //     callback(null, {content: slideServiceRes, theme: theme, selector: selector});
            //
            // });



        }//If presentation.content
    }

};


function getAfterDeck(res){
    let nextDeck, limit = 0;
    let items = res.revisions[0].contentItems;
    console.log('items', items, '\n\n');
    for(let i = 0; i < items.length; i++){
        if(items[i].kind === 'deck'){
            limit = i;
            nextDeck = items[i].ref.id;
            console.log('breaking');
            break;
        }
    }
    return {'limit': limit, 'nextDeck': nextDeck};
}

function getAdditionalSlideObject (parentDeck, nextDeck){
    let nextDeckURL = '/Presentation/' + String(parentDeck) + '/' + String(nextDeck);
    let content = '<div class=\"pptx2html\" style=\"position: relative; width: 960px; height: 720px;\">'
    + '<h3>End of Deck</h3>'
    + '<p>The next deck is at <a href="' + nextDeckURL + '">' + nextDeckURL + '</a></p>'
    + '</div>';
    let nextSlide = {
        'title': 'Next Subdeck',
        'content': content,
        'speakernotes': null,
        'type': 'slide',
        'id': 'next'
    };
    console.log('nextSlide: ', nextSlide);

    return nextSlide;

}
