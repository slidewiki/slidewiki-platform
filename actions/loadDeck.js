import async from 'async';
import {shortTitle} from '../configs/general';
import loadContent from './loadContent';
import loadContributors from './loadContributors';

export default function loadDeck(context, payload, done) {
    let pageTitle = shortTitle + ' | Deck | ' + payload.params.id;
    let payloadCustom = payload;
    //if no specific content selector is given, use the deck type, view mode and root deck id as default selector
    if(!payload.params.sid) {
        payloadCustom.params.sid = payload.params.id;
    }
    if(!payload.params.stype) {
        payloadCustom.params.stype = 'deck';
    }
    if(!payload.params.mode) {
        payloadCustom.params.mode = 'view';
    }
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
