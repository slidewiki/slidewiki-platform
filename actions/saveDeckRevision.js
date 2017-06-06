import UserProfileStore from '../stores/UserProfileStore';
import striptags from 'striptags';
import TreeUtil from '../components/Deck/TreePanel/util/TreeUtil';
import {navigateAction} from 'fluxible-router';
import serviceUnavailable from './error/serviceUnavailable';
import addActivity from './activityfeed/addActivity';
const log = require('./log/clog');
const common = require('../common.js');

export default function saveDeckRevision(context, payload, done) {
    log.info(context);
    // console.log('action saveDeckRevision: got payload', payload);
    //enrich with user id
    const userid = context.getStore(UserProfileStore).userid;

    let success = (res, payload) => {
        context.dispatch('UPDATE_DECKEDIT_VIEW_STATE', 'success');
        context.dispatch('SAVE_DECK_REVISION_SUCCESS', res);
        let newSid = res._id + '-' + res.revisions[0].id;
        let newPath = '';
        //root deck case
        if (payload.selector.id === payload.selector.sid) {
            context.executeAction(navigateAction, {
                url: '/deck/' + newSid
            });
        } else {
            if (payload.selector.spath !== '') {
                let pathArr = payload.selector.spath.split(';');
                let lastPath = pathArr[pathArr.length - 1];
                let lastPathPosition = lastPath.split(':')[1];
                pathArr[pathArr.length - 1] = newSid + ':' + lastPathPosition;
                newPath = pathArr.join(';');
            }
            // if deck edited is subdeck update the corresponding tree node
            if (payload.selector.id !== payload.selector.sid) {
                context.dispatch('UPDATE_TREE_NODE_SUCCESS', {
                    selector: payload.selector,
                    nodeSpec: {title: striptags(res.revisions[0].title), id: newSid, path: newPath}
                });
            }

            //update the URL: redirect to view after edit
            let newURL = '/deck/' + payload.selector.id + '/' + payload.selector.stype + '/' + newSid + '/' + newPath;
            context.executeAction(navigateAction, {
                url: newURL
            });
        }
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
        //enrich with root deck id if deck to be revised is not uppermost deck
        let parent = TreeUtil.getParentId(payload.selector);
        payload.root_deck = parent;
        context.service.update('deck.updateWithRevision', payload, null, {timeout: 30 * 1000}, (err, res) => {
            if (err) {
                context.dispatch('UPDATE_DECKEDIT_VIEW_STATE', 'error');
                context.dispatch('SAVE_DECK_REVISION_FAILURE', err);
                log.error(context, {filepath: __filename, err: err});
                // context.executeAction(serviceUnavailable, payload, done);
                done();
            } else {
                if (!common.arraysContainTheSameIdsInTheirObjects(payload.editors.old.users, payload.editors.new.users) || !common.arraysContainTheSameIdsInTheirObjects(payload.editors.old.groups, payload.editors.new.groups)) {
                    let payload2 = {
                        jwt: context.getStore(UserProfileStore).jwt,
                        editors: {},
                        deckId: res._id + '-' + res.revisions[0].id
                    };
                    payload2.editors.users = payload.editors.new.users.reduce((array, user) => {
                        let userCopy = JSON.parse(JSON.stringify(user));
                        delete userCopy.username;
                        delete userCopy.picture;
                        delete userCopy.country;
                        delete userCopy.organization;
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
                            context.dispatch('SAVE_DECK_REVISION_FAILURE', err);
                            log.error(context, {filepath: __filename, err: err});
                            done();
                        }
                        else {
                            success(res, payload);
                            done();
                        }
                    });

                    let activity = {
                        activity_type: 'edit',
                        user_id: String(context.getStore(UserProfileStore).userid),
                        content_id: String(newSid),
                        content_kind: 'deck'
                    };
                    context.executeAction(addActivity, {activity: activity});
                }
                else {
                    success(res, payload);
                    done();
                }
            }
        });
    }
}
