const log = require('../log/clog');
import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';
import Util from '../../components/common/Util';
import {navigateAction} from 'fluxible-router';

export default function addDeckTranslation(context, payload, done) {
    log.info(context);

    let actualPayload = {
        jwt: context.getStore(UserProfileStore).getState().jwt,
        // either just for the subdeck, or for the root deck 
        id: payload.selector.sid || payload.selector.id,
        language: payload.language,
    };

    // console.log('action addDeckTranslation deck id', actualPayload.id);

    context.service.update('deck.translations', actualPayload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message});
            context.executeAction(serviceUnavailable, payload, done);//TODO improve
        } else {
            let url = Util.makeNodeURL(payload.selector, 'deck', 'edit', undefined, payload.language);
            context.executeAction(navigateAction, { url }, done);
        }
    });
}
