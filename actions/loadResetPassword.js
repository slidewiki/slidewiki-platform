import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../stores/UserProfileStore';
import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');

export default function loadResetPassword(context, payload, done) {
    log.info(context, payload);
    //redirect to user settings if already logged in
    let store = context.getStore(UserProfileStore);
    if ((store.username !== undefined && store.username !== null && store.username !== '')
      && (store.userid !== undefined && store.userid !== null && store.userid !== '')
      && (store.jwt !== undefined && store.jwt !== null && store.jwt !== '')) {
        context.executeAction(navigateAction, {
            url: '/user/'+store.username+'/settings/account'
        }, done);
        return;
    }
    done();
}
