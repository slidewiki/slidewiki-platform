const log = require('../log/clog');
import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';
import Util from '../../components/common/Util';
import DeckTreeStore from '../../stores/DeckTreeStore';

export default function addSlideTranslation(context, payload, done) {
    log.info(context);

    payload.jwt = context.getStore(UserProfileStore).getState().jwt;

    // console.log('action addSlideTranslation selector', payload.selector);

    context.service.create('decktree.nodetranslation', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message });
            context.executeAction(serviceUnavailable, payload, done);//TODO improve
        } else {
            // console.log('addSlideTranslation service returned', res);

            // update selector
            let newSlideId = res.node.id + '-' + res.node.revision;
            let newPath = location.pathname.toString().replace(new RegExp(payload.selector.sid, 'g'), newSlideId);
            // replace 'view', if exists, with 'edit'
            newPath = newPath.replace(/\/(view)?$/, '');

            if (payload.markdown) {
                newPath = newPath + '/markdownEdit';
            } else {
                newPath = newPath + '/edit';
            }
            

            let params = new URLSearchParams(location.search);
            params.set('language', payload.language);

            context.executeAction(navigateAction, { url: newPath + '?' + params.toString() }, done);
        }
    });
}
