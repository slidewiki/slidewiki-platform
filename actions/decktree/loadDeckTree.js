import {shortTitle} from '../../configs/general';
import DeckTreeStore from '../../stores/DeckTreeStore';
import {deckIdTypeError, deckContentPathError, serviceUnavailable} from '../loadErrors';

export default function loadDeckTree(context, payload, done) {
    if (!(/^[0-9-]+$/.test(payload.params.id) && Number.parseInt(payload.params.id) >= 0)) {
        context.executeAction(deckIdTypeError, payload).catch((err) => {
            done(err);
        });
        return;
    }

    if (!(payload.params.spath && (/^[0-9a-z:;-]+$/.test(payload.params.spath)) || payload.params.spath === undefined || payload.params.spath === '')) {
        context.executeAction(deckContentPathError, payload).catch((err) => {
            done(err);
        });
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
                context.executeAction(serviceUnavailable, payload).catch((error) => {
                    done(error);
                });
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
