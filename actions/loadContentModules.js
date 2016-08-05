import {shortTitle} from '../configs/general';
import loadContentQuestions from './loadContentQuestions';
import loadDataSourceCount from './datasource/loadDataSourceCount';
import loadQuestionsCount from './questions/loadQuestionsCount';
import async from 'async';

export default function loadContentModules(context, payload, done) {
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined))
        console.log('Content type incorrect. Loading content modules failed.');

    if (!(/^[0-9a-zA-Z]+$/.test(payload.params.sid) || payload.params.sid === undefined))
        console.log('Slide id incorrect. Loading content modules failed.');

        //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(loadContentQuestions, payload, callback);
        },
        (callback) => {
            context.executeAction(loadDataSourceCount, payload, callback);
        },
        (callback) => {
            context.executeAction(loadQuestionsCount, payload, callback);
        }
    ],
    // final callback
    (err, results) => {
        if (err){
            console.log(err, 'Something extra');
        }
        context.dispatch('LOAD_CONTENT_MODULES_SUCCESS', {selector: payload.params, moduleType: 'questions'});
        let pageTitle = shortTitle + ' | Activities | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
