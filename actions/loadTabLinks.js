import async from 'async';
import {shortTitle} from '../configs/general';
import loadDataSourceCount from './datasource/loadDataSourceCount';
import loadQuestionsCount from './loadQuestionsCount';
import TabLinksStore from '../stores/TabLinksStore';


export default function loadTabLinks(context, payload, done) {
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined))
        console.log('Content type incorrect. Loading tab links failed.');

    if (!(/^[0-9a-zA-Z]+$/.test(payload.params.sid) || payload.params.sid === undefined))
        console.log('Slide id incorrect. Loading tab links failed.');

    if (!(payload.params.mode || payload.params.mode === undefined))
        console.log('Incorrect mode. Loading tab links failed.');

    let currentState = context.getStore(TabLinksStore).getState();
    let pageTitle = shortTitle + ' | TabLinks | ';
    let payloadCustom = payload;
    if(!payload.params.mode) {
        payloadCustom.params.mode = 'view';
    }

    let runNonContentActions = 1;
    if(currentState.selector.stype === payloadCustom.params.stype && parseInt(currentState.selector.sid) === parseInt(payloadCustom.params.sid)){
        runNonContentActions = 0;
    }

  //load all required actions in parallel
    async.parallel([
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadDataSourceCount, payloadCustom, callback);
            }
            else{
                context.dispatch('UPDATE_CONTENT_MODE', {mode: payloadCustom.params.mode});
                callback();
            }
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadQuestionsCount, payloadCustom, callback);
            }
            else{
                context.dispatch('UPDATE_CONTENT_MODE', {mode: payloadCustom.params.mode});
                callback();
            }
        },
        (callback) => {
          // if(runNonContentActions){
          //     context.executeAction(loadTranslations, payloadCustom, callback);
          // }else{
          //     callback();
          // }
            callback();
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
}
