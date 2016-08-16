import React from 'react';
import {NavLink} from 'fluxible-router';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import Tree from './Tree';
import toggleTreeNode from '../../../actions/decktree/toggleTreeNode';
import switchOnActionTreeNode from '../../../actions/decktree/switchOnActionTreeNode';
import renameTreeNode from '../../../actions/decktree/renameTreeNode';
import undoRenameTreeNode from '../../../actions/decktree/undoRenameTreeNode';
import saveTreeNode from '../../../actions/decktree/saveTreeNode';
import deleteTreeNodeAndNavigate from '../../../actions/decktree/deleteTreeNodeAndNavigate';
import addTreeNode from '../../../actions/decktree/addTreeNode';

class TreePanel extends React.Component {
    handleFocus() {

    }
    handleBlur() {

    }
    handleToggleNode(selector) {
        this.context.executeAction(toggleTreeNode, selector);
    }
    handleSwitchOnAction(selector) {
        this.context.executeAction(switchOnActionTreeNode, selector);
    }
    handleRenameNode(selector) {
        this.context.executeAction(renameTreeNode, selector);
    }
    handleUndoRenameNode(selector) {
        this.context.executeAction(undoRenameTreeNode, selector);
    }
    handleSaveNode(selector, oldValue, newValue) {
        this.context.executeAction(saveTreeNode, {selector: selector, oldValue: oldValue, newValue: newValue});
    }
    handleAddNode(selector, nodeSpec) {
        this.context.executeAction(addTreeNode, {selector: selector, nodeSpec: nodeSpec});
    }
    handleDeleteNode(selector) {
        this.context.executeAction(deleteTreeNodeAndNavigate, selector);
    }
    render() {
        const rootNodeStyles = {
            fontSize: '1.06em'
        };
        const treeDIVStyles = {
            maxHeight: 400,
            minHeight: 320,
            overflowY: 'auto',
            padding: 5
        };
        let deckTree = this.props.DeckTreeStore.deckTree;
        let selector = this.props.DeckTreeStore.selector;
        let prevSelector = this.props.DeckTreeStore.prevSelector;
        let nextSelector = this.props.DeckTreeStore.nextSelector;
        let rootNode = {'title': deckTree.get('title'), 'id': deckTree.get('id')};
        let rootNodeTitle = <strong> {rootNode.title} </strong>;
        let decktreeError = this.props.DeckTreeStore.error ? this.props.DeckTreeStore.error.msg : 0;
        return (
            <div className="ui panel sw-tree-panel" ref="treePanel" onFocus={this.handleFocus} onBlur={this.handleBlur}>
                <div className="ui segments">
                    <div className="3 fluid ui icon large buttons">
                        <div className="ui basic attached button" title="Theme">
                            <i className="theme black icon"></i>
                        </div>
                        <div className="ui basic attached button" title="Fork">
                            <i className="fork black icon"></i>
                        </div>
                        <div className="ui basic attached button" title="Translate">
                            <i className="translate black icon"></i>
                        </div>
                    </div>
                    <div className="ui secondary segment">
                        <NavLink style={rootNodeStyles} href={'/deck/' + rootNode.id}>{rootNodeTitle}</NavLink>
                    </div>
                    <div className="ui segment" style={treeDIVStyles}>

                        {decktreeError ? <div className="ui error message" style={{'wordBreak': 'break-all', 'wordWrap': 'break-word'}}> {decktreeError} </div> : ''}

                        <Tree deckTree={deckTree} rootNode={rootNode} selector={selector} nextSelector={nextSelector} prevSelector={prevSelector} items={deckTree.get('children')} page={this.props.page} mode={this.props.mode} onToggleNode={this.handleToggleNode.bind(this)} onSwitchOnAction= {this.handleSwitchOnAction.bind(this)} onRename={this.handleRenameNode.bind(this)} onUndoRename={this.handleUndoRenameNode.bind(this)} onSave={this.handleSaveNode.bind(this)} onAddNode={this.handleAddNode.bind(this)} onDeleteNode={this.handleDeleteNode.bind(this)}/>
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
