import {shortTitle} from '../../configs/general';
import DeckTreeStore from '../../stores/DeckTreeStore';
import serviceUnavailable from '../error/serviceUnavailable';
import deckIdTypeError from '../error/deckIdTypeError';
import deckContentPathError from '../error/deckContentPathError';
import { AllowedPattern } from '../error/util/allowedPattern';
const clog = require('../log/clog');

export default function loadDeckTree(context, payload, done) {
    clog.info(context, payload);
    if (!(AllowedPattern.DECK_ID.test(payload.params.id))) {
        context.executeAction(deckIdTypeError, payload, done);
        return;
    }

    if (!(payload.params.spath && (AllowedPattern.DECK_CONTENT_PATH.test(payload.params.spath)) || payload.params.spath === undefined || payload.params.spath === '')) {
        context.executeAction(deckContentPathError, payload, done);
        return;
    }
    let pageTitle = shortTitle + ' | Deck Tree | ' + payload.params.id;

    let currentSelector = context.getStore(DeckTreeStore).getSelector();

    let runFetchTree = 1;

    //runFetchTree flag may be passed through the navigate action to force deck tree fetch
    if (!payload.navigate.runFetchTree && currentSelector.id === payload.params.id) {
        runFetchTree = 0;
    }
    if (runFetchTree) {
        //we need to load the whole tree for the first time
        context.service.read('decktree.nodes', payload, {}, (err, res) => {
            if (err) {
                clog.error(context, payload, {filepath: __filename, err: err});
                context.executeAction(serviceUnavailable, payload, done);
                return;
            } else {
                context.dispatch('LOAD_DECK_TREE_SUCCESS', res);
                context.dispatch('UPDATE_PAGE_TITLE', {
                    pageTitle: pageTitle
                });
            }
            done();
        });
    } else {
        //when we only select the node in tree, there is no need to call the external service
        context.dispatch('SELECT_TREE_NODE_SUCCESS', payload.params);
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    }
}
