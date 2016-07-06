import {shortTitle} from '../../configs/general';
import DeckTreeStore from '../../stores/DeckTreeStore';

export default function loadDeckTree(context, payload, done) {
    let currentSelector = context.getStore(DeckTreeStore).getSelector();
    let runFetchTree = 1;
    if(parseInt(currentSelector.id) === parseInt(payload.params.id)){
        runFetchTree = 0;
    }
    let pageTitle = shortTitle + ' | Deck Tree | ' + payload.params.id;
    context.dispatch('UPDATE_PAGE_TITLE', {
        pageTitle: pageTitle
    });
    if(runFetchTree){
        //we need to load the whole tree for the first time
        context.service.read('decktree.nodes', payload, {}, (err, res) => {
            if (err) {
                context.dispatch('LOAD_DECK_TREE_FAILURE', err, res);
            } else {
                context.dispatch('LOAD_DECK_TREE_SUCCESS', res);
            }
            done();
        });
    }else{
        //when we only select the node in tree, there is no need to call the external service
        context.dispatch('SELECT_TREE_NODE_SUCCESS', payload.params);
        done();
    }
}
