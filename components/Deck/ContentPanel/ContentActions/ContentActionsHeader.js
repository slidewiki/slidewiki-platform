import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import ContentUtil from '../util/ContentUtil';
import DeckTreeStore from '../../../../stores/DeckTreeStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import addTreeNodeAndNavigate from '../../../../actions/decktree/addTreeNodeAndNavigate';
import deleteTreeNodeAndNavigate from '../../../../actions/decktree/deleteTreeNodeAndNavigate';
import AttachSubdeck from '../AttachSubdeck/AttachSubdeckModal';
import AttachSlides from '../AttachSubdeck/AttachSlidesModal';
import PermissionsStore from '../../../../stores/PermissionsStore';
import ContentStore from '../../../../stores/ContentStore';
import showNoPermissionsModal from '../../../../actions/permissions/showNoPermissionsModal';
import saveClick from '../../../../actions/slide/saveClick';
import undoClick from '../../../../actions/slide/undoClick';
import redoClick from '../../../../actions/slide/redoClick';

class ContentActionsHeader extends React.Component {

    componentDidUpdate(){

    }
    handleAddNode(selector, nodeSpec) {
        //selector: Object {id: "56", stype: "deck", sid: 67, spath: "67:2"}
        //nodeSec: Object {type: "slide", id: "0"}
        this.context.executeAction(addTreeNodeAndNavigate, {selector: selector, nodeSpec: nodeSpec});
    }

    handleDeleteNode(selector) {
        this.context.executeAction(deleteTreeNodeAndNavigate, selector);
    }

    handleSaveButtonClick(){
        this.context.executeAction(saveClick, {});
    }
    handleUndoButtonClick (){
        //this.context.executeAction(undoClick, {});
        //console.log('undo');
    }
    handleRedoButtonClick(){
        //this.context.executeAction(redoClick, {});
        //console.log('redo');
    }
    cancelButtonClick(selector){
        const nodeURL = ContentUtil.makeNodeURL(selector, 'view');
        this.context.executeAction(navigateAction, {
            url: nodeURL
        });
    }

    handleEditNode(selector) {
        const nodeURL = ContentUtil.makeNodeURL(selector, 'edit');
        if (this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit) {
            this.context.executeAction(showNoPermissionsModal, {selector: selector, user: this.props.UserProfileStore.userid, permissions: this.props.PermissionsStore.permissions});
        } else {
            this.context.executeAction(navigateAction, {
                url: nodeURL
            });
        }
    }
    render() {
        const contentDetails = this.props.ContentStore;
        //config buttons based on the selected item
        const addSlideClass = classNames({
            'item ui small basic left attached button': true,
            'disabled': this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'
        });
        const addDeckClass = classNames({
            'item ui small basic left attached button': true,
            'disabled': this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'
        });
        const duplicateItemClass = classNames({
            'item ui small basic left attached button': true,
            'disabled': contentDetails.selector.id === contentDetails.selector.sid || contentDetails.selector.stype==='deck' || this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'
        });
        const deleteItemClass = classNames({
            'item ui small basic left attached button': true,
            'disabled': contentDetails.selector.id === contentDetails.selector.sid || this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'
        });
        const red = {
            backgroundColor: 'red'
        };

        let selectorImm = this.props.DeckTreeStore.selector;
        let selector = {id: selectorImm.get('id'), stype: selectorImm.get('stype'), sid: selectorImm.get('sid'), spath: selectorImm.get('spath')};

        let buttonStyle = {
            classNames : classNames({
                'item small attached left':true,
                'disabled': this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'
            }),
            iconSize : 'large',
            attached : 'left',
            noTabIndex : this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'
        } ;
        let viewButton, editButton, undoButton, redoButton;
        if (contentDetails.mode === 'view')
        {
            if (this.props.UserProfileStore.username !== ''){
                viewButton =
                <NavLink activeClass=" " className={'item link' + (contentDetails.mode === 'view' ? ' active' : '')} href={ContentUtil.makeNodeURL(selector, 'view')} role={'tab'}>
                    <i></i>View
                </NavLink>;
                editButton =
                <div className={'item link' + (contentDetails.mode === 'edit' ? ' active' : '')} onClick={this.handleEditNode.bind(this, selector)} role={'tab'} tabIndex={'0'}>
                    <i className="ui large blue edit icon "></i> Edit
                </div>;
            } else {
                viewButton =
                <NavLink activeClass=" " className={'item link' + (contentDetails.mode === 'view' ? ' active' : '')} href={ContentUtil.makeNodeURL(selector, 'view')} role={'tab'}>
                    <i></i>View
                </NavLink> ;
            }
        } else {
            //edit mode
            if (this.props.UserProfileStore.username !== ''){
                /*viewButton =
                <NavLink style={red} activeClass=" " className="active item link" href={ContentUtil.makeNodeURL(selector, 'view')} role={'tab'}>
                    <i className="ui large black cancel icon "></i>
                    Cancel
                </NavLink>;

                <NavLink activeClass=" " className={'item link' + (contentDetails.mode === 'view' ? ' active' : '')} href={ContentUtil.makeNodeURL(selector, 'view')} role={'tab'}>
                <i className="cancel icon"></i>
                <a style={buttonTextBlack}>Cancel</a>
                </NavLink> ;*/

                viewButton =
                    <button tabIndex="0" ref="submitbutton" className="ui button " onClick={this.cancelButtonClick.bind(this, selector)} onChange={this.cancelButtonClick.bind(this, selector)}>
                         <i className="cancel icon large"></i>
                         cancel
                    </button>;
                editButton =
                    <button tabIndex="0" ref="submitbutton" className="ui button blue primary " onClick={this.handleSaveButtonClick.bind(this)} onChange={this.handleSaveButtonClick.bind(this)}>
                         <i className="save icon large"></i>
                         Save
                    </button>;
                undoButton =
                    <button tabIndex="0" ref="undoButton" className="ui orange button " onClick={this.handleUndoButtonClick.bind(this)} onChange={this.handleUndoButtonClick.bind(this)}>
                         <i className="reply icon large"></i>
                    </button>;
                redoButton =
                    <button tabIndex="0" ref="redoButton" className="ui orange button " onClick={this.handleRedoButtonClick.bind(this)} onChange={this.handleRedoButtonClick.bind(this)}>
                         <i className="mail forward icon large"></i>
                    </button>;
            } else {
                viewButton =
                    <NavLink activeClass=" " className='item link' onClick={this.cancelButtonClick.bind(this, selector)} href={ContentUtil.makeNodeURL(selector, 'view')} role={'tab'}>
                        <i></i>View
                    </NavLink>;
            }
        }

        return (
            <div className="ui top attached tabular menu" role="tablist">
                {viewButton} {editButton} {undoButton} {redoButton}
                {this.props.UserProfileStore.username === '' ? '' :
                    <div className="right menu">
                        <button className={addSlideClass} onClick={this.handleAddNode.bind(this, selector, {type: 'slide', id: '0'}) }
                          type="button"
                          aria-label="Add Slide"
                          data-tooltip="Add Slide"
                          tabIndex={this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'?-1:0}>
                            <i className="icons">
                              <i className="grey file large text icon"></i>
                              <i className="inverted corner plus icon"></i>
                            </i>

                        </button>
                        <AttachSlides buttonStyle={buttonStyle} selector={selector} />
                          <button className={addDeckClass} onClick={this.handleAddNode.bind(this, selector, {type: 'deck', id: '0'})}
                           type="button"
                           aria-label="Add Deck"
                           data-tooltip="Add Deck"
                           tabIndex={this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'?-1:0}>
                              <i className="medium icons">
                                <i className="yellow large folder icon"></i>
                                <i className="inverted corner plus icon"></i>
                              </i>
                          </button>
                          <AttachSubdeck buttonStyle={buttonStyle} selector={selector} />
                          <button className={duplicateItemClass} onClick={this.handleAddNode.bind(this, selector, {type: selector.stype, id: selector.sid})}
                           type="button"
                           aria-label="Duplicate"
                           data-tooltip="Duplicate"
                           tabIndex={contentDetails.selector.id === contentDetails.selector.sid || contentDetails.selector.stype==='deck' || this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'?-1:0}>
                              <i className="grey large copy icon"></i>

                          </button>
                          <button className={deleteItemClass} onClick={this.handleDeleteNode.bind(this, selector)}
                            type="button"
                            aria-label="Delete"
                            data-tooltip="Delete"
                            tabIndex={this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'?-1:0}>
                              <i className="red large trash icon"></i>
                          </button>
                          {/*
                          <button className="item ui small basic right attached disabled button">
                              <a className="" title="Settings">
                                  <i className="black large setting icon"></i>
                              </a>
                          </button>
                          */}
                      </div>
                  }
              </div>
        );
    }
  }
ContentActionsHeader.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
//it should listen to decktree store in order to handle adding slides/decks
ContentActionsHeader = connectToStores(ContentActionsHeader, [DeckTreeStore, UserProfileStore, PermissionsStore, ContentStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState(),
        ContentStore: context.getStore(ContentStore).getState()
    };
});
export default ContentActionsHeader;
