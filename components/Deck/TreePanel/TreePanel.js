import React from 'react';
import {NavLink} from 'fluxible-router';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import toggleTreeNode from '../../../actions/decktree/toggleTreeNode';
import Tree from './Tree';

class TreePanel extends React.Component {
    handleFocus() {
        key.setScope('tree'); // will allow specific tree keyborad actions
    }
    handleBlur() {
        key.setScope('all'); // will disallow specific tree keyborad actions
    }
    handleToggleNode(selector) {
        this.context.executeAction(toggleTreeNode, selector);
    }
    handleAddNode(path) {
        if(!path){
            // it means the root node is selected
        }else{

        }
    }
    handleDeleteNode(path) {
        if(!path){
            // it means the root node is selected
        }else{

        }
    }
    render() {
        const rootNodeStyles = {
            fontSize: '1.06em'
        };
        const treeDIVStyles = {
            maxHeight: '400',
            minHeight: '320',
            overflowY: 'auto',
            padding: '0'
        };
        let deckTree = this.props.DeckTreeStore.deckTree;
        let flatTree = this.props.DeckTreeStore.flatTree;
        let selector = this.props.DeckTreeStore.selector;
        let rootNode = {'title': deckTree.get('title'), 'id': deckTree.get('id')};
        let rootNodeTitle = <strong> {rootNode.title} </strong>;
        return (
            <div className="ui panel sw-tree-panel" ref="treePanel" onFocus={this.handleFocus} onBlur={this.handleBlur}>
                <div className="ui segments">
                    <div className="2 fluid ui attached bottom tertiary small icon buttons">
                        <div className="ui button">
                            <i className="blue search icon"></i>
                        </div>
                        <div className="ui button">
                            <i className="black ellipsis horizontal icon"></i>
                        </div>
                    </div>
                    <div className="ui secondary segment">
                        <NavLink style={rootNodeStyles} href={'/deck/' + rootNode.id}>{rootNodeTitle}</NavLink>
                    </div>
                    <div className="ui segment" style={treeDIVStyles}>
                        <Tree rootNode={rootNode} selector={selector} items={deckTree.get('children')} flatTree={flatTree} page={this.props.page} mode={this.props.mode} onToggleNode={this.handleToggleNode.bind(this)} onAddNode={this.handleAddNode.bind(this)} onDeleteNode={this.handleDeleteNode.bind(this)}/>
                    </div>
                </div>
             </div>
        );
    }
}

TreePanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
TreePanel = connectToStores(TreePanel, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default TreePanel;
