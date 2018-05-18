const log = require('../log/clog');
import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';
import Util from '../../components/common/Util';
import DeckTreeStore from '../../stores/DeckTreeStore';

export default function addSlideTranslation(context, payload, done) {
    log.info(context);

    payload.jwt = context.getStore(UserProfileStore).getState().jwt;

    console.log('action addSlideTranslation selector', payload.selector);

    context.service.create('decktree.nodetranslation', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);//TODO improve
            return;
        } else {
            console.log('addSlideTranslation service returned', res);

            //update selector
            payload.selector.sid = res.node.id + '-' + res.node.revision;
            let pathElements = res.selector.spath.split(';');
            let position = parseInt(pathElements[pathElements.length-1].split(':')[1]);
            pathElements[pathElements.length-1] = payload.selector.sid + ':' + position;
            payload.selector.spath = pathElements.join(';');

            const nodeURL = Util.makeNodeURL(payload.selector, 'deck', 'edit', undefined, payload.language);
            location.pathname = nodeURL.split('?')[0];
        }
        done();
    });
}
