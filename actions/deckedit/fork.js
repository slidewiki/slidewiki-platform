import UserProfileStore from '../../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';
import striptags from 'striptags';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function fork(context, payload, done) {
    log.info(context);
    //enrich with user id
    let userid = context.getStore(UserProfileStore).userid;

    if (userid == null || userid === '') {
        context.dispatch('UPDATE_DECKEDIT_VIEW_STATE', '');
        context.executeAction(navigateAction, {
            url: '/'
        });
        done();
    } else {
        //enrich with user id
        payload.userid = userid;
        context.service.update('deck.fork', payload, null, {timeout: 30 * 1000}, (err, res) => {
            if (err) {
                context.dispatch('UPDATE_DECKEDIT_VIEW_STATE', 'error');
                context.dispatch('SAVE_DECK_EDIT_FAILURE', err);
                log.error(context, {filepath: __filename, err: err});
                // context.executeAction(serviceUnavailable, payload, done);
            } else {
                context.dispatch('UPDATE_DECKEDIT_VIEW_STATE', 'success');
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
                let newSid = res._id + '-' + res.revisions[0].id;
                let newURL = '/deck/' + newSid;
                context.executeAction(navigateAction, {
                    url: newURL
                });
            }
            done();
        });
    }
}
