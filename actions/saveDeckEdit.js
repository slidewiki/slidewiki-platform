import UserProfileStore from '../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';
import striptags from 'striptags';
import { logger, breadcrumb } from '../configs/log';
import serviceUnavailable from './error/serviceUnavailable';

export default function saveDeckEdit(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    //enrich with user id
    let userid = context.getStore(UserProfileStore).userid;

    if (userid == null || userid === '') {
        context.executeAction(navigateAction, {
            url: '/'
        });
    } else {
        //enrich with user id
        payload.userid = userid;
        context.service.update('deck.update', payload, null, {timeout: 30 * 1000}, (err, res) => {
            if (err) {
                logger.error({reqId: payload.navigate.reqId, err: err});
                context.executeAction(serviceUnavailable, payload, done);
                //context.dispatch('SAVE_DECK_EDIT_FAILURE', err);
            } else {
                context.dispatch('SAVE_DECK_EDIT_SUCCESS', res);
                //console.log(payload.selector);
                context.dispatch('UPDATE_TREE_NODE_SUCCESS', {
                    selector: payload.selector,
                    nodeSpec: {
                        title: striptags(payload.title), id: payload.selector.sid,
                        path: payload.selector.spath
                    }
                });
                //update the URL: redirect to view after edit
                let newURL = '/deck/' + payload.selector.id + '/' + payload.selector.stype + '/' + payload.selector.sid + '/' + payload.selector.spath;
                context.executeAction(navigateAction, {
                    url: newURL
                });
            }
            done();
        });
    }
}
