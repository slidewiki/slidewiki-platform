import async from 'async';
import {shortTitle} from '../configs/general';
import loadContributors from './loadContributors';

export default function loadDeck(context, payload, done) {
    let pageTitle = shortTitle + ' | Deck | ' + payload.params.id;
    //load all required actions in parallel
    async.parallel([
        (callback)=> {
            context.executeAction(loadContributors, payload, callback);
        },
        (callback)=> {
            //another action
            callback(null);
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
