const log = require('../log/clog');
import UserProfileStore from '../../stores/UserProfileStore';
import DeckTreeStore from '../../stores/DeckTreeStore';
import serviceUnavailable from '../error/serviceUnavailable';
import Util from '../../components/common/Util';
import {navigateAction} from 'fluxible-router';

export default function addDeckTranslation(context, payload, done) {
    log.info(context);

    payload.jwt = context.getStore(UserProfileStore).getState().jwt;

    let currentSelector = context.getStore(DeckTreeStore).getState().selector.toJS();
    if (!payload.id) {
        // keep it compatible with modal that only adds to the root deck
        // TODO maybe remove this support
        payload.id = currentSelector.id;
    }

    // console.log('action addDeckTranslation deck id', payload.id);

    context.service.update('deck.translations', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message});
            context.executeAction(serviceUnavailable, payload, done);//TODO improve
        } else {
            delete currentSelector.spath;
            delete currentSelector.sid;
            currentSelector.stype = 'deck';
            let url = Util.makeNodeURL(currentSelector, 'plaindeck', 'edit', undefined, payload.language);
            location.href = url;
        }
    });
}
