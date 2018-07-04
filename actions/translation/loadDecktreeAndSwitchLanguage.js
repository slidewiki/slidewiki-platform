import {navigateAction} from 'fluxible-router';

import log from '../log/clog';
import DeckTreeStore from '../../stores/DeckTreeStore';
import loadDeckTree from '../decktree/loadDeckTree';
import Util from '../../components/common/Util';

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
        context.executeAction(loadDeckTree, {
            params: {
                id: selector.id,
                spath: selector.spath,
                sid: selector.sid,
                stype: selector.stype,
                language: payload.language,
                mode: location ? (location.pathname.split('/').pop() === 'edit' ? 'edit' : 'view') : 'view'
            },
            navigate: {
                runFetchTree: true
            },
            page: 'deck',
            instantNavigation: true
        }, done);
    else {
        let nodeURL = Util.makeNodeURL(selector, 'deck', '', undefined, payload.language);
        context.executeAction(navigateAction, { url: nodeURL }, done);
    }
}
