import async from 'async';
import {shortTitle} from '../configs/general';
import loadDataSourceCount from './datasource/loadDataSourceCount';
import TabLinksStore from '../stores/TabLinksStore';
export default function loadTabLinks(context, payload, done) {
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
          console.log("currentState ", currentState);
          console.log("payloadCustom ", payloadCustom);
          context.executeAction(loadDataSourceCount, payloadCustom, callback);
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
