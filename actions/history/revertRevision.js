import {navigateAction} from 'fluxible-router';
import striptags from 'striptags';
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');

export default function revertRevision(context, payload, done) {
    log.info(context);
    payload.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('history.revert', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('REVERT_REVISION_FAILURE', err);
        } else {
            context.dispatch('REVERT_REVISION_SUCCESS', res);
            let newSid = res._id + '-' + res.revisions[0].id;
            let newPath = '';
            if (payload.selector.spath !== '') {
                let pathArr = payload.selector.spath.split(';');
                let lastPath = pathArr[pathArr.length - 1];
                let lastPathPosition = lastPath.split(':')[1];
                pathArr[pathArr.length - 1] = newSid + ':' + lastPathPosition;
                newPath = pathArr.join(';');
            }
            let newURL = '/deck/' + payload.selector.id + '/' + payload.selector.stype + '/' + newSid + '/' + newPath;
            if (payload.selector.stype === 'slide') {
                context.dispatch('UPDATE_TREE_NODE_SUCCESS', {
                    selector: payload.selector,
                    nodeSpec: {title: striptags(res.revisions[0].title), id: newSid, path: newPath}
                });
                //update the URL
                context.executeAction(navigateAction, {
                    url: newURL
                });
            } else {
                //if reverting root deck
                if (payload.selector.id === payload.selector.sid) {
                    newURL = '/deck/' + newSid;
                }
                //update the URL, pass runFetchTree parameter to force deck tree fetching when reverting a subdeck
                context.executeAction(navigateAction, {
                    url: newURL,
                    runFetchTree: true
                });
            }
        }
        done();
    });
}
