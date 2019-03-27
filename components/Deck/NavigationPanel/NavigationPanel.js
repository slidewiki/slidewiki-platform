import React from 'react';
import Immutable from 'immutable';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import Breadcrumb from './Breadcrumb';
import DeckLanguageMenu from '../DeckLanguageMenu';

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
        let deckTree = this.props.DeckTreeStore.deckTree;
        let selector = this.props.DeckTreeStore.selector;

        return (<div>
            <Breadcrumb selector={selector} pathNames={this.getNameofNodes(deckTree, selector)} rootDeckName={deckTree.get('title')} />

            <DeckLanguageMenu lastAttached={this.props.lastAttached} />
        </div>);
    }
}

NavigationPanel = connectToStores(NavigationPanel, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default NavigationPanel;
