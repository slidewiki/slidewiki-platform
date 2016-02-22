import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import Tree from './Tree';

class TreePanel extends React.Component {
    render() {
        let rootNode = {title: this.props.DeckTreeStore.deckTree.title, id: this.props.DeckTreeStore.deckTree.id};
        return (
            <div className="ui panel sw-tree-panel" ref="treePanel">
                <div className="ui segments">
                    <div className="3 fluid ui attached bottom tertiary small icon buttons">
                        <div className="ui button">
                            <i className="blue add icon"></i>
                        </div>
                        <div className="ui button">
                            <i className="teal edit icon"></i>
                        </div>
                        <div className="ui button">
                            <i className="red remove icon"></i>
                        </div>
                    </div>
                    <div className="ui secondary segment">
                        <b><NavLink href={'/deck/' + rootNode.id}>{rootNode.title}</NavLink></b>
                    </div>
                    <div className="ui segment">
                        <Tree rootNode={rootNode} items={this.props.DeckTreeStore.deckTree.children} />
                    </div>
                </div>
             </div>
        );
    }
}

TreePanel = connectToStores(TreePanel, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default TreePanel;
