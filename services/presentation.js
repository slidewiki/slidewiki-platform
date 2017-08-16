import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'presentation',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        // console.log('req:', req, '\n\n');
        // console.log('resource': resource, '\n\n');
        console.log('params', params.params);
        console.log('this ', this);
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        // console.log('args', args);
        let selector = {
            'id': args.id, 'subdeck': args.subdeck, 'spath': args.spath,
            'sid': args.sid, 'stype': args.stype, 'mode': args.mode,
            'limit': 0, 'pushObj': null
        };
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


            rp.get({uri: uri}).then((res) => {
                slideServiceRes = JSON.parse(res);
                let afterDeck = getSubdeckInsideDeck(slideServiceRes);

                // TODO: A subdeck will have the wrong ID, so we'll only attempt this if it's a parent deck for now
                if(afterDeck.limit > 0 && !isSubdeck){
                    console.log('There is a limit > 0');
                    selector.limit = afterDeck.limit;
                    selector.pushObj = getAdditionalSlideObject(id, afterDeck.nextDeck);
                    returnContent(id, selector, callback);
                }
                else{
                    if(isSubdeck){
                        // Check to see if there are any slides/decks after the subdeck
                        rp.get({uri: Microservices.deck.uri + '/deck/' + String(args.id)}).then((parentDeck) => {

                            let nextSlideOrDeck = getParentDeckNextSlideOrDeck(id, parentDeck);
                            // Only push if there is an extra slide/deck
                            if(nextSlideOrDeck){
                                let isSlide = nextSlideOrDeck.kind === 'slide';
                                selector.pushObj = getAdditionalSlideObject(parentDeck.id, nextSlideOrDeck.nextDeck, isSlide);
                            }

                            returnContent(id, selector, callback);

                        }).catch((err) => {
                            console.log('Error in the stuff after the subdeck', err);
                        });
                    }
                    else{
                        // The parent deck won't have any slides/decks after it in this part of the tree
                        // Don't need to change selector for this one
                        returnContent(args.id, selector, callback);
                        // callback(null, {content: slideServiceRes.children, theme: slideServiceRes.theme, selector: selector});
                    }
                }
            }).catch((err) => {
                console.log('There was an error :-(', err);
            });
        }//If presentation.content
    }

};


function returnContent(id, selector, callback){
    let limit = selector.limit;
    let pushObj = selector.pushObj;
    let params = limit === 0 ? '' : '?limit=' + limit;
    rp.get(Microservices.deck.uri + '/deck/' + String(id) + '/slides' + params).then((slides) => {
        slides = JSON.parse(slides);
        if(pushObj !== null){
            slides.children.push(pushObj);
        }
        callback(null, {content: slides.children, theme: slides.theme, selector: selector});
    }).catch((err) => {
        console.log('returnContent', err);
    });
}

function getParentDeckNextSlideOrDeck(subDeckId, parentDeck){
    // This is used for the condition where we have a subdeck with slides/deck after it in the parent deck
    // This function returns the ID of the next Deck, and says if it is a slide or a deck
    // Note, the first argument is an integer, the second is a JSON string from /deck/{id}
    console.log('getParentDeckNextSlideOrDeck', subDeckId, parentDeck.id);
    parentDeck = JSON.parse(parentDeck);

    let next = false;
    let nextDeck, limit = 0;
    let items = parentDeck.revisions[0].contentItems;
    // console.log('parentDeck items', items, '\n\n');

    for(let i = 0; i < items.length; i++){
        let refId = items[i].ref.id;
        let revision = items[i].ref.revision;
        console.log('items[i].ref.id', refId);
        if(next){
            nextDeck = String(refId) + '-' + String(revision);
            console.log('Next deck/slide is ID ' + nextDeck + ' and is a ' + items[i].kind);
            return {'nextDeck': nextDeck, kind: items[i].kind};
        }

        if(refId === subDeckId || String(refId) + '-' + items[i].ref.revision === subDeckId){
            next = true;
        }
    }

}


function getSubdeckInsideDeck(res){
    // Use this function for a deck, where you are trying to see if there is a subdeck
    // It returns the limit, to say how many slides to load
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

function getAdditionalSlideObject (parentDeck, nextDeck, isSlide=false){
    let nextDeckURL = '/Presentation/';

    if(isSlide){
        nextDeckURL += parentDeck + '/#/slide-' + nextDeck;
    }
    else{
        nextDeckURL += String(parentDeck) + '/' + String(nextDeck);
    }
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
