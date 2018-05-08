const log = require('../log/clog');
import UserProfileStore from '../../stores/UserProfileStore';
import DeckTreeStore from '../../stores/DeckTreeStore';
import serviceUnavailable from '../error/serviceUnavailable';
import ContentUtil from '../../components/Deck/ContentPanel/util/ContentUtil';
import {navigateAction} from 'fluxible-router';

export default function addDeckTranslation(context, payload, done) {
    log.info(context);

    payload.jwt = context.getStore(UserProfileStore).getState().jwt;
    payload.id = context.getStore(DeckTreeStore).getState().selector.get('id');
    console.log('action addDeckTranslation selector', context.getStore(DeckTreeStore).getState().selector.get('id'));

    context.service.update('deck.translations', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);//TODO improve
            return;
        } else {
            context.dispatch('ADD_DECK_TRANSLATION_SUCCESS', res);
            let currentState = context.getStore(DeckTreeStore).getState().selector;
            let selector = {
                id: currentState.get('id'),
                stype: currentState.get('stype'),
                sid: currentState.get('sid'),
                spath: currentState.get('spath')
            };
            const nodeURL = ContentUtil.makeNodeURL(selector, 'edit', payload.language);
            context.executeAction(navigateAction, {
                url: nodeURL,
                runFetchTree: true
            });
        }
        done();
    });
}
