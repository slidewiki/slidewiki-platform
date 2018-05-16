const log = require('../log/clog');
import DeckTreeStore from '../../stores/DeckTreeStore';
import loadDeckTree from '../decktree/loadDeckTree';

export default function loadDecktreeAndSwitchLanguage(context, payload, done) {
    log.info(context);

    let currentState = context.getStore(DeckTreeStore).getState().selector;
    let selector = {
        id: currentState.get('id'),
        stype: currentState.get('stype'),
        sid: currentState.get('sid'),
        spath: currentState.get('spath')
    };

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
            runFetchTree: true,
            fetchWholeTree: true
        },
        page: 'deck'
    }, done);
}
