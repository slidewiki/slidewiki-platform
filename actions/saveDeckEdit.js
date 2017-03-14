import UserProfileStore from '../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';
import striptags from 'striptags';
import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');

export default function saveDeckEdit(context, payload, done) {
    log.info(context);
    // console.log('action saveDeckEdit: got payload', payload);
    //enrich with user id
    let userid = context.getStore(UserProfileStore).userid;

    let success = (res, payload) => {
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
        let newURL = '/deck/' + payload.selector.id + '/' + payload.selector.stype + '/' + payload.selector.sid + '/' + payload.selector.spath;
        context.executeAction(navigateAction, {
            url: newURL
        });
    };

    if (userid == null || userid === '') {
        context.dispatch('UPDATE_DECKEDIT_VIEW_STATE', '');
        context.executeAction(navigateAction, {
            url: '/'
        });
        done();
    } else {
        //enrich with user id
        payload.userid = userid;
        context.service.update('deck.update', payload, null, {timeout: 30 * 1000}, (err, res) => {
            if (err) {
                context.dispatch('UPDATE_DECKEDIT_VIEW_STATE', 'error');
                context.dispatch('SAVE_DECK_EDIT_FAILURE', err);
                log.error(context, {filepath: __filename, err: err});
                // context.executeAction(serviceUnavailable, payload, done);
                done();
            } else {
                if (payload.editors.old.users !== payload.editors.new.users || payload.editors.old.groups !== payload.editors.new.groups) {
                    let payload2 = {
                        jwt: context.getStore(UserProfileStore).jwt,
                        editors: payload.editors.new,
                        deckId: payload.deckId
                    };
                    context.service.update('deck.updateEditors', payload2, null, {timeout: 30 * 1000}, (err, res2) => {
                        if (err) {
                            context.dispatch('UPDATE_DECKEDIT_VIEW_STATE', 'error');
                            context.dispatch('SAVE_DECK_EDIT_FAILURE', err);
                            log.error(context, {filepath: __filename, err: err});
                            // context.executeAction(serviceUnavailable, payload, done);
                            done();
                        }
                        else {
                            success(res, payload);
                            done();
                        }
                    });
                }
                else {
                    success(res, payload);
                    done();
                }
            }
        });
    }
}
