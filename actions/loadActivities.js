import {shortTitle} from '../configs/general';
import async from 'async';
import loadContentDiscussion from './loadContentDiscussion';
import loadContentHistory from './loadContentHistory';
import loadContentUsage from './loadContentUsage';

export default function loadActivities(context, payload, done) {
    context.service.read('activities.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_ACTIVITIES_FAILURE', err);
        } else {
            context.dispatch('LOAD_ACTIVITIES_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Activities | ' + payload.params.stype + ' | ' + payload.params.sid;
        //load all required actions in parallel
        async.parallel([
            (callback) => {
                context.executeAction(loadContentDiscussion, payload, callback);
            },
            (callback) => {
                context.executeAction(loadContentHistory, payload, callback);
            },
            (callback) => {
                context.executeAction(loadContentUsage, payload, callback);
            }
        ],
        // final callback
        (err, results) => {
            if (err){
                console.log(err);
            }
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: pageTitle
            });
            done();
        });
    });
}
