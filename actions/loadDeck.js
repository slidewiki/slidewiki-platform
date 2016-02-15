import async from 'async';
import {shortTitle} from '../configs/general';
import loadContent from './loadContent';
import loadContributors from './loadContributors';

export default function loadDeck(context, payload, done) {
    let pageTitle = shortTitle + ' | Deck | ' + payload.params.id;
    let payloadCustom = payload;
    //if no specific content selector is given, use the deck type, view mode and root deck id as default selector
    if(!payload.params.stype) {
        payloadCustom.params.stype = 'deck';
    }
    if(!payload.params.sid) {
        payloadCustom.params.sid = payload.params.id;
    }
    //position is an optional parameter which might get confused with the mode, therefore we need to disambiguate it:
    if(payload.params.sposition) {
        if(!payload.params.mode){
            //if sposition is not a numeric value, it means it refers to the mode
            if(isNaN(payload.params.sposition)){
                payloadCustom.params.mode = payload.params.sposition;
                payloadCustom.params.sposition = 0;
            }else{
                payloadCustom.params.mode = 'view';
            }
        }
    }else{
        payloadCustom.params.mode = 'view';
    }
    pageTitle = pageTitle + ' | ' + payloadCustom.params.stype + ' | ' + payloadCustom.params.sid + ' | ' + payloadCustom.params.mode;
    //load all required actions in parallel
    async.parallel([
        (callback)=> {
            context.executeAction(loadContent, payloadCustom, callback);
        },
        (callback)=> {
            context.executeAction(loadContributors, payloadCustom, callback);
        },
        (callback)=> {
            //another sample action with timeout
            setTimeout(()=>{
                callback(null);
            }, 200);
        }
    ],
    // final callback
    (err, results)=> {
        if (err){
            console.log(err);
        }
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
