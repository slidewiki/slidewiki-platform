import React from 'react';
import Immutable from 'immutable';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import Breadcrumb from './Breadcrumb';

class NavigationPanel extends React.Component {
    getNameofNodes(tree, selector) {
        if(!selector.get('spath')){
            return 0;
        }
        let names = [];
        let nodes = selector.get('spath').split(';');
        let currentChildren = tree.get('children');
        let position = 0;
        nodes.forEach ((node, index) => {
            position = node.split(':')[1];
            names.push(currentChildren.get(position - 1).get('title'));
            if(currentChildren.get(position - 1).get('children')){
                currentChildren = currentChildren.get(position - 1).get('children');
            }
        });
        return names;
    }
    render() {
        let deckTree = Immutable.fromJS(this.props.DeckTreeStore.deckTree);
        let selector = Immutable.fromJS(this.props.DeckTreeStore.selector);
        return (
            <div className="ui menu sw-deck-navigation-panel" ref="navigationPanel">
               <div className="item">
                 <Breadcrumb selector={selector} pathNames={this.getNameofNodes(deckTree, selector)} rootDeckName={deckTree.get('title')} />
               </div>
             </div>
        );
    }
}

NavigationPanel = connectToStores(NavigationPanel, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default NavigationPanel;
