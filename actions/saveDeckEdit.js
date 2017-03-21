import UserProfileStore from '../stores/UserProfileStore';
import PermissionsStore from '../stores/PermissionsStore';
import {navigateAction} from 'fluxible-router';
import striptags from 'striptags';
import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');
const common = require('../common.js');

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
                // TODO properly decouple editors forms from properties forms
                // for now we skip this if current user is not admin
                if (!context.getStore(PermissionsStore).permissions.admin) {
                    success(res, payload);
                    return done();
                }

                if (!common.arraysEqual(payload.editors.old.users, payload.editors.new.users) || !common.arraysEqual(payload.editors.old.groups, payload.editors.new.groups)) {
                    let payload2 = {
                        jwt: context.getStore(UserProfileStore).jwt,
                        editors: {},
                        deckId: res._id + '-' + res.revisions[0].id
                    };
                    payload2.editors.users = payload.editors.new.users.reduce((array, user) => {
                        let userCopy = JSON.parse(JSON.stringify(user));
                        delete userCopy.username;
                        delete userCopy.picture;
                        array.push(userCopy);
                        return array;
                    }, []);
                    payload2.editors.groups = payload.editors.new.groups.reduce((array, group) => {
                        let groupCopy = JSON.parse(JSON.stringify(group));
                        delete groupCopy.name;
                        array.push(groupCopy);
                        return array;
                    }, []);
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
