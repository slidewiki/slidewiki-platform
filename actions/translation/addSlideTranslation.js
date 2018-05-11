const log = require('../log/clog');
import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';
import ContentUtil from '../../components/Deck/ContentPanel/util/ContentUtil';

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
            context.dispatch('ADD_SLIDE_TRANSLATION_SUCCESS', res);
            payload.selector.sid = res.node.id + '-' + res.node.revision;
            const nodeURL = ContentUtil.makeNodeURL(payload.selector, 'edit', payload.language);
            context.executeAction(navigateAction, {
                url: nodeURL,
                runFetchTree: true
            });
        }
        done();
    });
}
