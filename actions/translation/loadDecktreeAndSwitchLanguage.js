const log = require('../log/clog');
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
        const nodeURL = Util.makeNodeURL(selector, 'deck', location ? (location.pathname.split('/').pop() === 'edit' ? 'edit' : 'view') : 'view', undefined, payload.language);
        location.href = location.origin + nodeURL;

        done();
    }
}
