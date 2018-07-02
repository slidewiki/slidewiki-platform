const log = require('../log/clog');
import DeckTreeStore from '../../stores/DeckTreeStore';
import loadDeckTree from '../decktree/loadDeckTree';
import Util from '../../components/common/Util';
import {navigateAction} from 'fluxible-router';

export default function loadDecktreeAndSwitchLanguage(context, payload, done) {
    log.info(context);

    let currentState = context.getStore(DeckTreeStore).getState().selector;
    let selector = {
        id: currentState.get('id'),
        stype: currentState.get('stype'),
        sid: currentState.get('sid'),
        spath: currentState.get('spath')
    };

    if (selector.stype === 'slide')
        context.service.read('decktree.nodetranslation', {params: selector}, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);//TODO improve
                return;
            } else {
                console.log('getSLideTranslation service returned', res);

                // match the language
                let newNode = res.nodes.find((t) => t.language === payload.language);
                if (!newNode) {
                    // match the primary
                    newNode = res.nodes.find((t) => t.original);
                    // should have one, but language is different
                } 

                let newSlideId = newNode.id + '-' + newNode.revision;
                let newPath = location.pathname.toString().replace(new RegExp(selector.sid, 'g'), newSlideId);

                // replace language in search params
                let params = new URLSearchParams(location.search);
                params.set('language', payload.language);

                context.executeAction(navigateAction, { url: newPath + '?' + params.toString() }, done);
            }
        });
    else {
        let params = new URLSearchParams(location.search);
        params.set('language', payload.language);

        context.executeAction(navigateAction, { url: location.pathname + '?' + params.toString() }, done);
    }
}
