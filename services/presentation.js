import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;
import async from 'async';

export default {
    name: 'presentation',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {

        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;

        let selector = {
            'id': args.id, 'subdeck': args.subdeck, 'sid': args.sid, //'spath': args.spath,
            // 'stype': args.stype, 'mode': args.mode,
            'limit': 0, 'pushObj': null
        };
        if(args.sid){
            args.sid = args.sid.replace('slide-', '')
        }
        console.log('selector: ', selector);
        // console.log('params', params);
        //Load the whole presentation
        let presentation = [];
        if(resource === 'presentation.content'){
            /*********connect to microservices*************/
            let returnErr = false;

            // let id = args.subdeck === args.id ? args.id : args.subdeck;
            let isSubdeck = (args.id !== args.subdeck);
            let id = isSubdeck ? args.subdeck : args.id;
            console.log('args: ', args, 'id: ', id, 'isSubdeck: ', isSubdeck);

            // let subdeck = args.subdeck;
            let allSlides, deckInfo;
            // console.log('args: ', args, '\n\nid:', id);
            if(isSubdeck){
                console.log('isSubdeck is true');
                let uri = Microservices.deck.uri + '/deck/' + String(id) + '/slides';
                console.log('uri: ', uri);
                rp.get({uri: uri}).then((all) => {
                    allSlides = JSON.parse(all);
                    callback(null, {content: allSlides.children, theme: allSlides.theme, selector: selector});
                }).catch((err) => {
                    console.log('Error retrieving the slides', err);
                });
            }
            else {
                async.parallel([
                    (done) => {
                        rp.get({uri: Microservices.deck.uri + '/deck/' + String(id) + '/slides'}).then((all) => {
                            allSlides = JSON.parse(all);
                            done();
                        }).catch((err) => {
                            console.log('Error retrieving the slides', err);
                        });
                    },
                    (done) => {
                        rp.get({uri: Microservices.deck.uri + '/deck/' + String(args.id)}).then((deck) => {
                            deckInfo = JSON.parse(deck);
                            done();
                        }).catch((err) => {
                            console.log('Error getting deck information', err);
                        });
                    }
                ], (err, results) => {
                    if(err){
                        console.log(err);
                    }
                    console.log('About to return content');

                    let nextSubdeckInside = isSubdeckInsideDeck(deckInfo, allSlides);

                    if(nextSubdeckInside === 0){
                        // Load all content for a parent deck with no subdecks
                        console.log('No subdeck inside, so loading all content');
                        callback(null, {content: allSlides.children, theme: allSlides.theme, selector: selector});
                    }
                    else{
                        console.log('There is a subdeck inside the deck');
                        // There is a subdeck inside this deck.
                        // We need to check if it's from deck view (load from the start to next subdeck)
                        // Or a slide view (load from end of previous deck to next subdeck)

                        let sid = selector.sid ? selector.sid : 0;


                        if(!sid){
                            // Should be loading from the start
                            let pushObj = getAdditionalSlideObject (args.id, nextSubdeckInside.nextDeck);
                            console.log('pushObj', pushObj);
                            allSlides.children = allSlides.children.slice(0, nextSubdeckInside.limit);
                            allSlides.children.push(pushObj);
                            callback(null, {content: allSlides.children, theme: allSlides.theme, selector: selector});
                        }
                        else{
                            console.log('Slide view, so need to check more carefully');
                            let nextDeckParams = getNextSubdeck(deckInfo, allSlides, sid);

                            allSlides.children = allSlides.children.slice(nextDeckParams.offset, nextDeckParams.limit);
                            if(nextDeckParams.nextDeck){
                                let pushObj = getAdditionalSlideObject (args.id, nextDeckParams.nextDeck);
                                console.log('pushObj', pushObj);
                                allSlides.children.push(pushObj);
                            }

                            callback(null, {content: allSlides.children, theme: allSlides.theme, selector: selector});
                        }
                    }
                });
            }


        }//If presentation.content
    }
};

function isSubdeckInsideDeck(deck, slidesInfo){
    let items = deck.revisions[0].contentItems;

    for(let i = 0; i < items.length; i++){
        let item = items[i];
        if(item.kind === 'deck'){
            let refId = String(item.ref.id) + '-' + String(item.ref.revision);
            console.log('subdeck inside index ', i);
            return {nextDeck: refId, limit: i};
        }
    }
    return 0;
}

function getNextSubdeck(deck, allSlides, currentId=0){
    console.log('getNextSubdeck params currentId: ', currentId);
    // If currentId > 0, we are on a slide view, and so need to check the previous and next decks
    // It might not be the start
    let seenCurrentId = currentId > 0 ? true : false;
    // let seenNextDeck = false;
    // let seenPreviousDeck = false;
    let firstSlide = 0;
    // let setOffsetNext = false;
    let lastSlide = 0;
    let nextDeck = 0;
    let deckOffsetId = 0;
    let deckLimitId = 0;
    let lastItemDeck = true;
    // let nextSlideOffset = false;
    // if(currentId > 0){
    let items = deck.revisions[0].contentItems;
    for(let i=0; i < items.length; i++){
        let item = items[i];
        let refId = String(item.ref.id) + '-' + String(item.ref.revision);
        console.log('lastItemDeck: ', lastItemDeck, 'index: ', i);
        // Calculate offset
        // if we haven't seen the current slide, and it's a deck, change the offset to the deck
        if(item.kind === 'deck'){

            // console.log('item.kind === deck');
            // if(!seenCurrentId){
            //     console.log('!seenCurrentId');
            //
            //
            // }
            if(seenCurrentId){
                deckOffsetId = firstSlide;
                deckLimitId = lastSlide;
                let returnVal = {'limit': 0, 'offset': 0, nextDeck: refId};
                for(let j=0; j < allSlides.children.length; j++){
                    console.log('\ndeckOffsetId: ', deckOffsetId, 'deckLimitId: ', deckLimitId, 'current iteration: ', allSlides.children[j].id);
                    if(allSlides.children[j].id === deckOffsetId){
                        // console.log('MATCH! deckOffsetId: ', deckOffsetId, ' === allSlides.children[j]', allSlides.children[j]);
                        returnVal.offset = j;
                    }
                    if(allSlides.children[j].id === deckLimitId){
                        // console.log('MATCH! deckLimitId: ', deckLimitId, ' === allSlides.children[j]', allSlides.children[j]);
                        returnVal.limit = j + 1;
                        console.log('returnVal', returnVal);
                        return returnVal;
                    }
                }

            }
            console.log('last item: deck at index ', i);
            lastItemDeck = true;
        }
        else if(item.kind === 'slide'){
            console.log('lastItemDeck: ', lastItemDeck, '!seenCurrentId', !seenCurrentId);
            if(lastItemDeck && !seenCurrentId){
                firstSlide = refId;
                console.log('firstSlide: ', firstSlide, 'at index ', i);
            }
            lastSlide = refId;
            if(currentId === refId){
                seenCurrentId = true;
            }
            console.log('last item: slide at index ', i);
            //     console.log('lastItemDeck: ', lastItemDeck);
            //     if(lastItemDeck){
            //         firstSlide = refId;
            //         console.log('firstSlide = refId', refId);
            //     }
            // }
            // if(!seenCurrentId){
            //     firstSlide = refId;
            //     console.log('firstSlide: ', firstSlide, 'at index ', i);
            // }
            lastItemDeck = false;
        }

    }
    return {'limit': allSlides.children.length, 'offset': deckOffsetId};
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

    return nextSlide;

}
