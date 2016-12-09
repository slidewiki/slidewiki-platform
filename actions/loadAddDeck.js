import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../stores/UserProfileStore';
//import { logger, breadcrumb} from '../configs/log';

export default function loadAddDeck(context, payload, done) {
    //logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    //redirect to homepage if not logged in
    let store = context.getStore(UserProfileStore);
    if (!((store.username !== undefined && store.username !== null && store.username !== '')
      && (store.userid !== undefined && store.userid !== null && store.userid !== '')
      && (store.jwt !== undefined && store.jwt !== null && store.jwt !== ''))) {
        context.executeAction(navigateAction, {url: '/'});//, reqId: payload.navigate.reqId});
        $('.ui.login.modal').modal('show');
    }
    done();
}
