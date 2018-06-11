const log = require('../log/clog');
import UserProfileStore from '../../stores/UserProfileStore';
import DeckTreeStore from '../../stores/DeckTreeStore';
import serviceUnavailable from '../error/serviceUnavailable';
import Util from '../../components/common/Util';
import {navigateAction} from 'fluxible-router';

export default function addDeckTranslation(context, payload, done) {
    log.info(context);

    payload.jwt = context.getStore(UserProfileStore).getState().jwt;
    payload.id = context.getStore(DeckTreeStore).getState().selector.get('id');
    // console.log('action addDeckTranslation deck id', payload.id);

    context.service.update('deck.translations', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);//TODO improve
            return;
        } else {
            let currentState = context.getStore(DeckTreeStore).getState().selector;
            let selector = {
                id: currentState.get('id'),
                stype: currentState.get('stype'),
                sid: '',
                spath: ''
            };
            const nodeURL = Util.makeNodeURL(selector, 'plaindeck', 'view', undefined, payload.language);
            location.href = location.origin + nodeURL;
        }
        done();
    });
}
