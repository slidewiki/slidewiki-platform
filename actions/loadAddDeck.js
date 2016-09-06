import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../stores/UserProfileStore';
export default function loadAddDeck(context, payload, done) {
    //redirect to homepage if not logged in
    let store = context.getStore(UserProfileStore);
    if (!((store.username !== undefined && store.username !== null && store.username !== '')
      && (store.userid !== undefined && store.userid !== null && store.userid !== '')
      && (store.jwt !== undefined && store.jwt !== null && store.jwt !== ''))) {
        context.executeAction(navigateAction, {
            url: '/'
        });
    }
    done();
}
