import async from 'async';
import DeckTreeStore from '../../stores/DeckTreeStore';
import {navigateAction} from 'fluxible-router';
import moveTreeNodeWithRevisionCheck from './moveTreeNodeWithRevisionCheck';

export default function moveTreeNodeAndNavigate(context, payload, done) {
    //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(moveTreeNodeWithRevisionCheck, payload, callback);
        }],
        // final callback
        (err, results) => {
            if (!err) {
                let newURL;
                let removedChangeset = results[0].removed_changeset || results[0].changeset, insertedChangeset = results[0].inserted_changeset;
                let hasRevisionChanges = removedChangeset || insertedChangeset;
                if (hasRevisionChanges) {
                    console.log(removedChangeset, insertedChangeset, payload);
                    let rootId = payload.selector.id;
                    if (removedChangeset && removedChangeset.new_deck_id != null){
                        rootId = removedChangeset.new_deck_id;
                    } else if (insertedChangeset && insertedChangeset.new_deck_id != null){
                        rootId = insertedChangeset.new_deck_id;
                    }
                    newURL = '/deck/' + rootId;
                } else {
                    //the logic for retrieving the moved node's selector is handled in the stores
                    //therefore, we need to get access to the selector from the store
                    let currentState = context.getStore(DeckTreeStore).getState();
                    let selector = {
                        id: currentState.selector.get('id'),
                        stype: currentState.selector.get('stype'),
                        sid: currentState.selector.get('sid'),
                        spath: currentState.selector.get('spath')
                    };
                    newURL = selector.spath !== '' ? '/deck/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath : '/deck/' + selector.id;
                }
                //navigate to new url and force deck tree refetch in case of revisioning changes
                context.executeAction(navigateAction, {
                    url: newURL,
                    runFetchTree: hasRevisionChanges
                });
            }
            done();
        });
}
