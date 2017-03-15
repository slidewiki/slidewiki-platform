import {shortTitle} from '../../configs/general';
import DeckTreeStore from '../../stores/DeckTreeStore';
import serviceUnavailable from '../error/serviceUnavailable';
import deckIdTypeError from '../error/deckIdTypeError';
import deckContentPathError from '../error/deckContentPathError';
import { AllowedPattern } from '../error/util/allowedPattern';
import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');

export default function loadDeckTree(context, payload, done) {
    log.info(context);
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

    //get deck permissions
    let payload2 = {
        sid: payload.params.id,
        jwt: context.getStore(UserProfileStore).jwt
    };
    context.service.read('deck.permissions', payload2, {timeout: 20 * 1000}, (err, res) => {
        let permissions = {
            fork: false,
            edit: false,
            admin: false
        };
        if (res && res.fork !== undefined)
            permissions = JSON.parse(JSON.stringify(res));
        console.log('action loadDeckTree:', payload);
        log.info(context, 'Got permissions for '+payload2.sid+' which are '+JSON.stringify(permissions));
        payload.params.permissions = permissions;
        //runFetchTree flag may be passed through the navigate action to force deck tree fetch
        if (!payload.navigate.runFetchTree && currentSelector.id === payload.params.id) {
            runFetchTree = 0;
        }
        if (runFetchTree) {
            //we need to load the whole tree for the first time
            context.service.read('decktree.nodes', payload, {}, (err, res) => {
                if (err) {
                    log.error(context, {filepath: __filename, err: err});
                    context.executeAction(serviceUnavailable, payload, done);
                    return;
                } else {
                    res.permissions = permissions;
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
    });
}
