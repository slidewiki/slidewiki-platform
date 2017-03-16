import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import UserProfileStore from '../../../stores/UserProfileStore';
import Tree from './Tree';
import toggleTreeNode from '../../../actions/decktree/toggleTreeNode';
import switchOnActionTreeNode from '../../../actions/decktree/switchOnActionTreeNode';
import renameTreeNode from '../../../actions/decktree/renameTreeNode';
import undoRenameTreeNode from '../../../actions/decktree/undoRenameTreeNode';
import saveTreeNodeWithRevisionCheck from '../../../actions/decktree/saveTreeNodeWithRevisionCheck';
import deleteTreeNodeAndNavigate from '../../../actions/decktree/deleteTreeNodeAndNavigate';
import addTreeNodeAndNavigate from '../../../actions/decktree/addTreeNodeAndNavigate';
import forkDeck from '../../../actions/decktree/forkDeck';
import moveTreeNodeAndNavigate from '../../../actions/decktree/moveTreeNodeAndNavigate';

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
        this.context.executeAction(saveTreeNodeWithRevisionCheck, {
            selector: selector,
            oldValue: oldValue,
            newValue: newValue
        });
    }

    handleAddNode(selector, nodeSpec) {
        this.context.executeAction(addTreeNodeAndNavigate, {selector: selector, nodeSpec: nodeSpec});
    }

    handleDeleteNode(selector) {
        this.context.executeAction(deleteTreeNodeAndNavigate, selector);
    }

    handleFork() {
        swal({
            title: 'New Fork',
            text: 'We are forking the deck...',
            type: 'success',
            timer: 2000,
            showCloseButton: false,
            showCancelButton: false,
            allowEscapeKey: false,
            showConfirmButton: false
        });
        this.context.executeAction(forkDeck, {deckId: this.props.DeckTreeStore.selector.get('id')});
    }

    handleTheme() {
        swal({
            title: 'Themes',
            text: 'This feature is still under construction...',
            type: 'info',
            confirmButtonText: 'Confirmed',
            confirmButtonClass: 'positive ui button',
            buttonsStyling: false
        });
        this.context.executeAction(forkDeck, {deckId: this.props.DeckTreeStore.selector.get('id')});
    }

    handleTranslation() {
        swal({
            title: 'Translation',
            text: 'This feature is still under construction...',
            type: 'info',
            confirmButtonText: 'Confirmed',
            confirmButtonClass: 'positive ui button',
            buttonsStyling: false
        });
        this.context.executeAction(forkDeck, {deckId: this.props.DeckTreeStore.selector.get('id')});
    }

    handleMoveNode(sourceNode, targetNode, targetIndex) {
        this.context.executeAction(moveTreeNodeAndNavigate, {
            selector: this.props.DeckTreeStore.selector.toJS(),
            sourceNode: sourceNode,
            targetNode: targetNode,
            targetIndex: targetIndex
        });
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

        let classes_forksbtn = classNames({
            'ui': true,
            'basic': true,
            'attached': true,
            'disabled': (!this.props.DeckTreeStore.permissions.fork),
            'button': true
        });

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
                    {this.props.UserProfileStore.username === '' ? '' :
                        <div className="3 fluid ui icon large buttons">
                            <div className="ui basic disabled attached button" aria-label="Theme" data-tooltip="Theme"
                                 onClick={this.handleTheme.bind(this)}>
                                <i className="theme black icon"></i>
                            </div>
                            <div className={classes_forksbtn} aria-label="Fork" data-tooltip="Fork" onClick={this.handleFork.bind(this)}>
                                <i className="fork black icon"></i>
                            </div>
                            <div className="ui basic disabled attached button" aria-label="Translate" data-tooltip="Translate"
                                 onClick={this.handleTranslation.bind(this)}>
                                <i className="translate black icon"></i>
                            </div>
                        </div>
                    }
                    <div className="ui secondary segment">
                        <NavLink style={rootNodeStyles} href={'/deck/' + rootNode.id}>{rootNodeTitle}</NavLink>
                    </div>
                    <div className="ui segment" style={treeDIVStyles}>

                        {decktreeError ? <div className="ui error message" style={{
                            'wordBreak': 'break-all',
                            'wordWrap': 'break-word'
                        }}> {decktreeError} </div> : ''}

                        <Tree deckTree={deckTree} rootNode={rootNode} selector={selector} nextSelector={nextSelector}
                              prevSelector={prevSelector} page={this.props.page}
                              mode={this.props.mode} onToggleNode={this.handleToggleNode.bind(this)}
                              onSwitchOnAction={this.handleSwitchOnAction.bind(this)}
                              onRename={this.handleRenameNode.bind(this)}
                              onUndoRename={this.handleUndoRenameNode.bind(this)}
                              onSave={this.handleSaveNode.bind(this)}
                              onAddNode={this.handleAddNode.bind(this)} onDeleteNode={this.handleDeleteNode.bind(this)}
                              onMoveNode={this.handleMoveNode.bind(this)}
                              username={this.props.UserProfileStore.username}
                              permissions={this.props.DeckTreeStore.permissions}/>
                    </div>
                </div>
            </div>
        );
    }
}

TreePanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
TreePanel = connectToStores(TreePanel, [DeckTreeStore, UserProfileStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default TreePanel;
