import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import Breadcrumb from './Breadcrumb';

class NavigationPanel extends React.Component {
    getNameofNodes(tree, selector) {
        if(!selector.spath){
            return 0;
        }
        let names = [];
        let nodes = selector.spath.split(';');
        let currentChildren = tree.children;
        let position = 0;
        nodes.forEach ((node, index) => {
            position = node.split(':')[1];
            names.push(currentChildren[position - 1].title);
            if(currentChildren[position - 1].children){
                currentChildren = currentChildren[position - 1].children;
            }
        });
        return names;
    }
    render() {
        return (
            <div className="ui menu sw-deck-navigation-panel" ref="navigationPanel">
               <div className="item">
                 <Breadcrumb selector={this.props.DeckTreeStore.selector} pathNames = {this.getNameofNodes(this.props.DeckTreeStore.deckTree, this.props.DeckTreeStore.selector)} rootDeckName={this.props.DeckTreeStore.deckTree.title} />
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
