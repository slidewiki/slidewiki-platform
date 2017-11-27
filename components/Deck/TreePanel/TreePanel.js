import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import UserProfileStore from '../../../stores/UserProfileStore';
import Tree from './Tree';
import toggleTreeNode from '../../../actions/decktree/toggleTreeNode';
import focusTreeNode from '../../../actions/decktree/focusTreeNode';
import switchOnActionTreeNode from '../../../actions/decktree/switchOnActionTreeNode';
import renameTreeNode from '../../../actions/decktree/renameTreeNode';
import undoRenameTreeNode from '../../../actions/decktree/undoRenameTreeNode';
import saveTreeNode from '../../../actions/decktree/saveTreeNode';
import deleteTreeNodeAndNavigate from '../../../actions/decktree/deleteTreeNodeAndNavigate';
import addTreeNodeAndNavigate from '../../../actions/decktree/addTreeNodeAndNavigate';
import moveTreeNodeAndNavigate from '../../../actions/decktree/moveTreeNodeAndNavigate';
import loadTranslations from '../../../actions/loadTranslations';
import PermissionsStore from '../../../stores/PermissionsStore';
import ForkModal from './ForkModal';
import TranslationModal from '../Translation/TranslationModal';
import NavigationPanel from './../NavigationPanel/NavigationPanel';


class TreePanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isForkModalOpen: false,
            isTranslationModalOpen: false
        };
    }

    handleFocus() {

    }

    handleBlur() {

    }

    handleToggleNode(selector) {
        this.context.executeAction(toggleTreeNode, selector);
    }

    handleFocusNode(selector) {
        this.context.executeAction(focusTreeNode, selector);
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
        this.context.executeAction(saveTreeNode, {
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
        this.setState({isForkModalOpen: true});
    }

    handleTheme() {
        swal({
            title: 'Themes',
            text: 'This feature is still under construction...',
            type: 'info',
            confirmButtonText: 'Confirmed',
            confirmButtonClass: 'positive ui button',
            buttonsStyling: false
        })
            .then(() => {/* Confirmed */}, (reason) => {/* Canceled */});
    }

    handleTranslation() {
        // swal({
        //     title: 'Translation',
        //     text: 'This feature is still under construction...',
        //     type: 'info',
        //     confirmButtonText: 'Confirmed',
        //     confirmButtonClass: 'positive ui button',
        //     buttonsStyling: false
        // });
        // this.context.executeAction(forkDeck, {deckId: this.props.DeckTreeStore.selector.get('id')});
        this.setState({isTranslationModalOpen: true});
    }

    handleMoveNode(sourceNode, targetNode, targetIndex) {
        //only when logged in and having rights
        if (this.props.UserProfileStore.username !== '' && this.props.PermissionsStore.permissions.edit && !this.props.PermissionsStore.permissions.readOnly)
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
            maxHeight: 600,
            minHeight: 320,
            overflowY: 'auto',
            padding: 5
        };
        const SegmentStyles = {
            padding: 0
        };
        let classes_forksbtn = classNames({
            'ui': true,
            'basic': true,
            'attached': true,
            'disabled': (!this.props.PermissionsStore.permissions.fork),
            'button': true
        });

        let classes_translatebtn = classNames({
            'ui': true,
            'basic': true,
            'attached': true,
            'disabled': (!this.props.PermissionsStore.permissions.fork),
            'button': true
        });

        let deckTree = this.props.DeckTreeStore.deckTree;
        let selector = this.props.DeckTreeStore.selector;
        let prevSelector = this.props.DeckTreeStore.prevSelector;
        let nextSelector = this.props.DeckTreeStore.nextSelector;
        let rootNode = {'title': deckTree.get('title'), 'id': deckTree.get('id')};
        let rootNodeTitle = <strong>{rootNode.title} </strong>;
        let decktreeError = this.props.DeckTreeStore.error ? this.props.DeckTreeStore.error.msg : 0;
        return (
            <div className="ui container" ref="treePanel" role="navigation" onFocus={this.handleFocus} onBlur={this.handleBlur}>
                <NavigationPanel />
                <div className="ui segment bottom attached active tab" style={SegmentStyles}>

                    {/*  <h2 className="ui medium header">Deck: <NavLink style={rootNodeStyles} href={'/deck/' + rootNode.id}>{rootNodeTitle}</NavLink></h2> */}

                    {this.props.UserProfileStore.username === '' ? '' :
                        <div className="ui icon fluid buttons">
                        <div className={classes_forksbtn} aria-label="Fork this deck to create your own copy" tabIndex="0" role="button" data-tooltip="Fork deck" onClick={this.handleFork.bind(this)}>
                            <i className="large blue fork icon"></i>
                        </div>
                        <div className={classes_translatebtn} role="button" aria-label="See in other language" data-tooltip="Translate deck"
                            onClick={this.handleTranslation.bind(this)} tabIndex="1">
                            <i className="translate blue large icon"></i>
                        </div>
                    </div>
                    }


                    <div className="ui attached segment" style={treeDIVStyles}>
                        {decktreeError ? <div className="ui error message" style={{
                            'wordBreak': 'break-all',
                            'wordWrap': 'break-word'
                        }}> {decktreeError} </div> : ''}

                        <Tree deckTree={deckTree} rootNode={rootNode} selector={selector} focusedSelector={this.props.DeckTreeStore.focusedSelector} nextSelector={nextSelector}
                            prevSelector={prevSelector} page={this.props.page}
                            mode={this.props.mode} onToggleNode={this.handleToggleNode.bind(this)} onFocusNode={this.handleFocusNode.bind(this)}
                            onSwitchOnAction={this.handleSwitchOnAction.bind(this)}
                            onRename={this.handleRenameNode.bind(this)}
                            onUndoRename={this.handleUndoRenameNode.bind(this)}
                            onSave={this.handleSaveNode.bind(this)}
                            onAddNode={this.handleAddNode.bind(this)} onDeleteNode={this.handleDeleteNode.bind(this)}
                            onMoveNode={this.handleMoveNode.bind(this)}
                            username={this.props.UserProfileStore.username}
                            permissions={this.props.PermissionsStore.permissions}/>
                    </div>
                </div>
                <ForkModal selector={selector.toJS()} isOpen={this.state.isForkModalOpen} forks={this.props.PermissionsStore.ownedForks} handleClose={() => this.setState({isForkModalOpen: false})} />
                <TranslationModal selector={selector.toJS()} mode='deck' isOpen={this.state.isTranslationModalOpen} forks={this.props.PermissionsStore.ownedForks} handleClose={() => this.setState({isTranslationModalOpen: false})} />
            </div>
        );
    }
}

TreePanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
TreePanel = connectToStores(TreePanel, [DeckTreeStore, UserProfileStore, PermissionsStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default TreePanel;
