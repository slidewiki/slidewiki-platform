const log = require('../log/clog');
import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';
import Util from '../../components/common/Util';
import DeckTreeStore from '../../stores/DeckTreeStore';

export default function addSlideTranslation(context, payload, done) {
    log.info(context);

    payload.jwt = context.getStore(UserProfileStore).getState().jwt;

    console.log('action addSlideTranslation selector', payload.selector);

    context.service.create('decktree.nodetranslation', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);//TODO improve
            return;
        } else {
            console.log('addSlideTranslation service returned', res);
            context.dispatch('ADD_SLIDE_TRANSLATION_SUCCESS', res);

            //update selector
            payload.selector.sid = res.node.id + '-' + res.node.revision;
            let pathElements = res.selector.spath.split(';');
            let position = parseInt(pathElements[pathElements.length-1].split(':')[1]);
            pathElements[pathElements.length-1] = payload.selector.sid + ':' + position;
            payload.selector.spath = pathElements.join(';');

            //update deck tree in DeckTreeStore because it should be correct? Does not work - throws Cannot read property 'parent' of undefined from Dispatcher
            // let deckTree = context.getStore(DeckTreeStore).getState().deckTree;
            // deckTree.id = payload.selector.sid;
            // context.dispatch('UPDATE_TREE_NODE_SUCCESS', {
            //     selector: payload.selector,
            //     nodeSpec: deckTree
            // });

            const nodeURL = Util.makeNodeURL(payload.selector, payload.selector.page, 'edit', undefined, payload.language);
            context.executeAction(navigateAction, {
                url: nodeURL,
                runFetchTree: true,
                fetchWholeTree: true
            });
        }
        done();
    });
}
