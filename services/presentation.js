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
            let allSlides, deckInfo;

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

                let isSubdeckInside = isSubdeckInsideDeck(deckInfo, allSlides);


                if(!isSubdeck && !isSubdeckInside){
                    // Load all content for a parent deck with no subdecks
                    console.log('\n\n\n\n!isSubdeck && !isSubdeckInside\n\n\n\n');
                    returnContent(id, selector, allSlides, callback);
                }
                else{
                    let paramsAndNextDeck = getParamsAndNextDeck(deckInfo, allSlides);
                    selector.pushObj = getAdditionalSlideObject (args.id, paramsAndNextDeck.nextDeck);
                    selector.limit = paramsAndNextDeck.limit;
                    selector.offset = paramsAndNextDeck.offset;

                    if(!isSubdeck){
                        // If we are between a subdeck and the end, set offset to first slide after the subdeck
                        // params = getParams(deck, allSlides);
                        returnContent(id, selector, allSlides, callback);
                    }
                    else {
                        // Find the next deck, and load add the slide to all slides
                        // selector.nextDeck = getNextSubdeck(deckInfo, id);
                        returnContent(id, selector, allSlides, callback);
                    }
                }
            });

        }//If presentation.content
    }
};


function returnContent(id, selector, slides, callback){
    console.log('inside returnContent');
    let limit = selector.limit;
    let offset = selector.offset;
    let pushObj = selector.pushObj;
    let params = '';
    // let params = '?offset=' + selector.offset;
    // params = limit === 0 ? params : params + '&limit=' + selector.limit;
    let slideContent = limit === 0 ? slides.children.slice(offset, limit) : slides.children.slice(offset);
    if(pushObj !== null){
        slideContent.push(pushObj);
    }
    callback(null, {content: slides.children, theme: slides.theme, selector: selector});
    // rp.get(Microservices.deck.uri + '/deck/' + String(id) + '/slides' + params).then((slides) => {
    //     slides = JSON.parse(slides);
    //     if(pushObj !== null){
    //         slides.children.push(pushObj);
    //     }
    //     callback(null, {content: slides.children, theme: slides.theme, selector: selector});
    // }).catch((err) => {
    //     console.log('returnContent', err);
    // });
}

function isSubdeckInsideDeck(deck, slidesInfo){
    console.log('deck: ', deck);
    let nextDeck, limit, offset = 0;
    // if we have a deck (currentId = 0) then we don't need to worry about the offset
    let items = deck.revisions[0].contentItems;

    for(let i = 0; i < items.length; i++){
        // let refId = String(items[i].ref.id) + '-' + String(items[i].ref.revision);
        if(items[i].kind === 'deck'){
            // deckIndex = i;
            return i;
        }
    }
    return 0;
}

function getNextSubdeck(deck, currentDeck){
    // For the condition where we have a subdeck, in a parent deck which might have more than one subdeck
    let seenDeck = false;
    let items = deck.revisions[0].contentItems;
    console.log('getNextSubdeck items', items);
    for(let i=0; i< items.length; i++){
        let refId = String(items[i].ref.id) + '-' + String(items[i].ref.revision);
        console.log('getNextSubdeck comparison refId: ' + refId + 'currentDeck: ', currentDeck);
        if(seenDeck && items.kind === 'deck'){
            return refId;
        }
        if(currentDeck === refId && items.kind === 'deck'){
            seenDeck = true;
        }
    }
    return 0;
}

function getParamsAndNextDeck(deck, allSlides, currentId=0){
    // This function sorts out the parameters and gets the nextDeck for decks with subdecks

    let nextDeck = 0;
    let limit = 0;
    let offset = 0;
    let lastSlideParent = 0;
    let lastSlideSub = 0;
    // if we have a deck (currentId = 0) then we don't need to worry about the offset
    let seenCurrentPos = currentId > 0 ? false : true;
    let items = deck.revisions[0].contentItems;
    let contentAfterDeck = false;

    for(let i = 0; i < items.length; i++){
        let refId = String(items[i].ref.id) + '-' + String(items[i].ref.revision);
        console.log('getParamsAndNextDeck', refId, limit, offset);
        if(!seenCurrentPos){
            if(refId === currentId || items[i].ref.id === currentId){ // Use or in case there's no revision
                seenCurrentPos = true;
            }
        }
        if(items[i].kind === 'deck'){
            if(seenCurrentPos && nextDeck !== 0){
                // limit = i;
                nextDeck = refId;
                console.log('The next subdeck ID is: ', nextDeck);
            }
            else{
                // offset = i;
            }
        }
        else{
            if(nextDeck !== 0){
                // This means we do have other content after this deck, so need to set a limit
                contentAfterDeck = true;
                console.log('setting contentAfterDeck = true');
                lastSlideSub = refId;
                break;
            }
            else if (!seenCurrentPos) {
                offset += 1;
            }
            else{
                // This is the last slide before the extra content
                lastSlideParent = refId;
            }
        }
    }
    if(!contentAfterDeck){
        // We can just load the whole deck after the offset
        console.log('No content after deck');
        return {'offset': offset, 'limit': 0, 'nextDeck': null};
    }
    else{
        console.log('There IS content after deck');
        limit = getLimit(lastSlideParent, lastSlideSub, allSlides);
    }
    return {'limit': limit, 'offset': offset, 'nextDeck': nextDeck};

}

function getLimit(limit, lastParent, lastSubdeck, allSlides){
    // Iterate through allSlides, and select slides between these two.
    let seenLastParent, seenLastSubdeck = false;
    let count = 0;
    for(let i=0; i < allSlides.children.length; i++){
        count += 1;
        let slide = allSlides.children[i];
        if(!seenLastParent){
            if(slide.id === lastParent){
                seenLastParent = true;
            }
        }
        else{
            if(seenLastSubdeck){
                return count;
            }
        }
    }
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
