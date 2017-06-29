import async from 'async';
import DeckTreeStore from '../../stores/DeckTreeStore';
import {navigateAction} from 'fluxible-router';
import moveTreeNode from './moveTreeNode';
const log = require('../log/clog');

export default function moveTreeNodeAndNavigate(context, payload, done) {
    log.info(context);
    //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(moveTreeNode, payload, callback);
        }],
        // final callback
        (err, results) => {
            if (!err) {
                let newURL;
                let {selector, sourceNode, targetNode} = payload;
                if (selector.stype === 'deck' && selector.sid === selector.id) {
                    // if we were at the root deck stay there
                    newURL = '/deck/' + selector.id;
                } else if (selector.stype === 'deck' && selector.sid === targetNode.get('id') && selector.spath === targetNode.get('path') && targetNode.get('children').includes(sourceNode)){
                    // if we are at the subdeck view and we move a node within *that* subdeck navigate there
                    newURL = '/deck/' + selector.id + '/deck/' + targetNode.get('id') + '/' + targetNode.get('path');
                } else {
                    // the logic for retrieving the moved node's selector is handled in the stores
                    // therefore, we need to get access to the selector from the store
                    let newSelector = context.getStore(DeckTreeStore).getState().selector;
                    newURL = '/deck/' + newSelector.get('id') + '/' + newSelector.get('stype') + '/' + newSelector.get('sid') + '/' + newSelector.get('spath');
                }
                //navigate to new url
                context.executeAction(navigateAction, {
                    url: newURL
                });
            }
            else {
                log.error(context, {filepath: __filename});
            }
            done();
        });
}
