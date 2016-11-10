import async from 'async';
import { shortTitle } from '../configs/general';
// import loadContentDiscussion from './contentdiscussion/loadContentDiscussion';
import loadDataSources from './datasource/loadDataSources';
import loadDataSourceCount from './datasource/loadDataSourceCount';
//import loadQuestionsCount from './questions/loadQuestionsCount';
import loadCommentsCount from './contentdiscussion/loadCommentsCount';
import deckContentTypeError from './error/deckContentTypeError';
import slideIdTypeError from './error/slideIdTypeError';
import { AllowedPattern } from './error/util/allowedPattern';

export default function loadContentModules(context, payload, done) {
    if (!(['deck', 'slide'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)){
        context.executeAction(deckContentTypeError, payload, done);
        return;
    }

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

        //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(loadDataSources, payload, callback);
        },
        // (callback) => {
        //     context.executeAction(loadContentDiscussion, payload, callback);
        // },
        (callback) => {
            context.executeAction(loadDataSourceCount, payload, callback);
        },
        /*
        (callback) => {
            context.executeAction(loadQuestionsCount, payload, callback);
        },
        */
        (callback) => {
            context.executeAction(loadCommentsCount, payload, callback);
        }
    ],
    // final callback
    (err, results) => {
        if (err){
            console.log(err, 'Something extra');
        }
        context.dispatch('LOAD_CONTENT_MODULES_SUCCESS', {selector: payload.params, moduleType: 'datasource'});
        let pageTitle = shortTitle + ' | Activities | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
