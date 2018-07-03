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
            let newPath = location.pathname;
            // replace view with edit in new path, to show edit form for new deck translation
            // remove it first if it exists, then append it
            // newPath = newPath.replace(/\/view$/, '');
            // newPath = newPath + '/edit';

            // also replace the language
            let params = new URLSearchParams(location.search);
            params.set('language', payload.language);

            context.executeAction(navigateAction, { url: newPath + '?' + params.toString() }, done);
        }
    });
}
