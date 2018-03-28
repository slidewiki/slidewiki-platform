import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../stores/UserProfileStore';
import updateTrap from '../actions/loginModal/updateTrap';
import log from './log/clog';

export default function loadAddDeck(context, payload, done) {
    log.info(context);
    //redirect to homepage if not logged in
    let store = context.getStore(UserProfileStore);
    if (!((store.username !== undefined && store.username !== null && store.username !== '')
      && (store.userid !== undefined && store.userid !== null && store.userid !== '')
      && (store.jwt !== undefined && store.jwt !== null && store.jwt !== ''))) {
        context.executeAction(navigateAction, {url: '/'});//, reqId: payload.navigate.reqId});
        //prepraring the modal
        context.executeAction(updateTrap,{activeTrap:true});
        //hidden the other page elements to readers
        $('#app').attr('aria-hidden','true');

        $('.ui.login.modal')
        .modal({
            onVisible: () => {
                //This class is added automatically when the modal is called from a component, not an action.
                //If it is not set, the dimmer is not disabled when the modal is hidden
                $('body').addClass('dimmable dimmed');
            },
            onHidden: () => {
                context.executeAction(updateTrap,{activeTrap:false});
                $('#app').attr('aria-hidden','false');
            }

        }). modal('show');
    }
    done();
}
