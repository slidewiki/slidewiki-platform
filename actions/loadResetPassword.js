import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../stores/UserProfileStore';
import { logger, breadcrumb} from '../configs/log';
import serviceUnavailable from './error/serviceUnavailable';

export default function loadResetPassword(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    //redirect to user settings if already logged in
    let store = context.getStore(UserProfileStore);
    if ((store.username !== undefined && store.username !== null && store.username !== '')
      && (store.userid !== undefined && store.userid !== null && store.userid !== '')
      && (store.jwt !== undefined && store.jwt !== null && store.jwt !== '')) {
        context.executeAction(navigateAction, {
            url: '/user/'+store.username+'/settings'
        }, done);
        return;
    }
    done();
}
