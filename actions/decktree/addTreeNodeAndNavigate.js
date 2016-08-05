import async from 'async';
import {navigateAction} from 'fluxible-router';
import DeckTreeStore from '../../stores/DeckTreeStore';
import addTreeNode from './addTreeNode';
import TreeUtil from '../../components/Deck/TreePanel/util/TreeUtil';

export default function addTreeNodeAndNavigate(context, payload, done) {
    //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(addTreeNode, payload, callback);
        }
    ],
    // final callback
    (err, results) => {
        //the logic for retrieving the parent node is handles in the stores
        //therefore, we need to get access to the selector from the store
        let currentState= context.getStore(DeckTreeStore).getState();
        let selector = {id: currentState.selector.get('id'), stype: currentState.selector.get('stype'), sid: currentState.selector.get('sid'), spath: currentState.selector.get('spath')};
        context.executeAction(navigateAction, {
            url: TreeUtil.makeNodeURL(selector, 'deck', 'edit')
        });
        done();
    });
}
