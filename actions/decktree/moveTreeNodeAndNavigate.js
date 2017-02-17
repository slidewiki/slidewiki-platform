import async from 'async';
import DeckTreeStore from '../../stores/DeckTreeStore';
import {navigateAction} from 'fluxible-router';
import moveTreeNodeWithRevisionCheck from './moveTreeNodeWithRevisionCheck';
const log = require('../log/clog');

export default function moveTreeNodeAndNavigate(context, payload, done) {
    log.info(context, payload);
    //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(moveTreeNodeWithRevisionCheck, payload, callback);
        }],
        // final callback
        (err, results) => {
            if (!err) {
                let newURL;
                let {selector, sourceNode, targetNode} = payload;
                let removedChangeset = results[0].removed_changeset || results[0].changeset, insertedChangeset = results[0].inserted_changeset;
                let hasRevisionChanges = removedChangeset || insertedChangeset;
                if (hasRevisionChanges) {
                    let rootId = selector.id;
                    // a new revision for the root deck may have been created
                    if (removedChangeset && removedChangeset.new_deck_id != null){
                        rootId = removedChangeset.new_deck_id;
                    } else if (insertedChangeset && insertedChangeset.new_deck_id != null){
                        rootId = insertedChangeset.new_deck_id;
                    }
                    newURL = '/deck/' + rootId;
                } else if (selector.stype === 'deck' && selector.sid === selector.id) {
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
                //navigate to new url and force deck tree refetch in case of revisioning changes
                context.executeAction(navigateAction, {
                    url: newURL,
                    runFetchTree: hasRevisionChanges
                });
            }
            else {
                log.error(context, payload, {filepath: __filename, err: err});
            }
            done();
        });
}
