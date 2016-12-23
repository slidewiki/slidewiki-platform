import UserProfileStore from '../stores/UserProfileStore';
import handleRevisionChangesAndNavigate from './revisioning/handleRevisionChangesAndNavigate';
import striptags from 'striptags';
import TreeUtil from '../components/Deck/TreePanel/util/TreeUtil';
import {navigateAction} from 'fluxible-router';
import serviceUnavailable from './error/serviceUnavailable';
const clog = require('./log/clog');

export default function saveDeckRevision(context, payload, done) {
    clog.info(context, payload);
    //enrich with user id
    let userid = context.getStore(UserProfileStore).userid;

    if (userid == null || userid === '') {
        context.executeAction(navigateAction, {
            url: '/'
        });
    } else {
        //enrich with user id
        payload.userid = userid;
        //enrich with root deck id if deck to be revised is not uppermost deck
        let parent = TreeUtil.getParentId(payload.selector);
        payload.root_deck = parent;
        context.service.update('deck.updateWithRevision', payload, null, {timeout: 30 * 1000}, (err, res) => {
            if (err) {
                clog.error(context, payload, {filepath: __filename, err: err});
                context.executeAction(serviceUnavailable, payload, done);
                //context.dispatch('SAVE_DECK_REVISION_FAILURE', err);
            } else {
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
                    context.executeAction(handleRevisionChangesAndNavigate, {
                        selector: {
                            id: payload.selector.id,
                            stype: payload.selector.stype,
                            sid: newSid,
                            spath: newPath
                        },
                        changeset: res.changeset
                    });
                }
            }
            done();
        });
    }
}
