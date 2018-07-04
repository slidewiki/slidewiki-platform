import PropTypes from 'prop-types';
import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import Util from '../../../common/Util';
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
import cancelClick from '../../../../actions/slide/cancelClick';
import undoClick from '../../../../actions/slide/undoClick';
import redoClick from '../../../../actions/slide/redoClick';
import {defineMessages} from 'react-intl';
import TranslationStore from '../../../../stores/TranslationStore';
import {getLanguageName, getLanguageNativeName} from '../../../../common';
import DeckTranslationsModal from '../Translation/DeckTranslationsModal';
import addSlideTranslation from '../../../../actions/translation/addSlideTranslation';
import changeLoadingState from '../../../../actions/translation/changeLoadingState';


class ContentActionsHeader extends React.Component {
    constructor(props){
        super(props);
        this.messages = defineMessages({
            viewButtonText:{
                id: 'ContentActionsHeader.viewButtonText',
                defaultMessage:'View'
            },
            viewButtonAriaText:{
                id: 'ContentActionsHeader.viewButtonAriaText',
                defaultMessage:'View Mode'
            },
            editButtonText:{
                id: 'ContentActionsHeader.editButtonText',
                defaultMessage:'Edit'
            },
            editButtonTextTranslation:{
                id: 'ContentActionsHeader.editButtonTextTranslation',
                defaultMessage:'Edit node translation'
            },
            editButtonAriaText:{
                id: 'ContentActionsHeader.editButtonAriaText',
                defaultMessage:'Edit Mode'
            },
            addSlideButtonAriaText:{
                id: 'ContentActionsHeader.addSlideButtonAriaText',
                defaultMessage:'Add Slide'
            },
            addDeckButtonAriaText:{
                id: 'ContentActionsHeader.addDeckButtonAriaText',
                defaultMessage:'Add sub-deck'
            },
            duplicateAriaText:{
                id: 'ContentActionsHeader.duplicateAriaText',
                defaultMessage:'Duplicate slide'
            },
            deleteAriaText:{
                id: 'ContentActionsHeader.deleteAriaText',
                defaultMessage:'Delete slide'
            },
            language:{
                id: 'ContentActionsHeader.language',
                defaultMessage:'Language'
            },
            translation:{
                id: 'ContentActionsHeader.translation',
                defaultMessage:'Translation'
            },
            loading:{
                id: 'ContentActionsHeader.loading',
                defaultMessage:'Loading'
            },
        });
    }


    handleAddNode(selector, nodeSpec) {
        //selector: Object {id: "56", stype: "deck", sid: 67, spath: "67:2"}
        //nodeSec: Object {type: "slide", id: "0"}
        const contentDetails = this.props.ContentStore;
        //added mode to the navigate action
        this.context.executeAction(addTreeNodeAndNavigate, {selector: selector, nodeSpec: nodeSpec, mode: contentDetails.mode});
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
    handleCancelButtonClick(selector){
        this.context.executeAction(cancelClick, {
            selector: selector
        });
    }
    handleViewButton(selector) {
        const nodeURL = Util.makeNodeURL(selector, selector.page, 'view');
        this.context.executeAction(navigateAction, {
            url: nodeURL
        });

    }

    handleEditButton(selector) {
        const nodeURL = Util.makeNodeURL(selector, selector.page, 'edit');
        if (this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit) {
            this.context.executeAction(showNoPermissionsModal, {selector: selector, user: this.props.UserProfileStore.userid, permissions: this.props.PermissionsStore.permissions});
        } else {
            this.context.executeAction(navigateAction, {
                url: nodeURL
            });
        }
    }

    handleMarkdownEditButton(selector) {
        const nodeURL = Util.makeNodeURL(selector, selector.page, 'markdownEdit');
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
        const editClass = classNames({
            'ui button attached basic': true,
            //'disabled': this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'
        });
        const viewClass = classNames({
            'ui basic button': true,
            'disabled': contentDetails.mode ==='view'
        });
        const addSlideClass = classNames({
            'ui basic button': true,
            'disabled': this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit' || contentDetails.mode ==='markdownEdit' || this.props.TranslationStore.inTranslationMode
        });
        const addDeckClass = classNames({
            'ui basic button': true,
            'disabled': this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit' || contentDetails.mode ==='markdownEdit' || this.props.TranslationStore.inTranslationMode
        });
        const duplicateItemClass = classNames({
            'ui basic button': true,
            'disabled': contentDetails.selector.id === contentDetails.selector.sid || contentDetails.selector.stype==='deck' || this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'  || contentDetails.mode ==='markdownEdit' || this.props.TranslationStore.inTranslationMode
        });
        const deleteItemClass = classNames({
            'ui basic button': true,
            'disabled': contentDetails.selector.id === contentDetails.selector.sid || this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'  || contentDetails.mode ==='markdownEdit' || this.props.TranslationStore.inTranslationMode
        });
        const red = {
            backgroundColor: 'red'
        };

        let selectorImm = this.props.DeckTreeStore.selector;
        let selector = {id: selectorImm.get('id'), stype: selectorImm.get('stype'), sid: selectorImm.get('sid'), spath: selectorImm.get('spath')};

        let buttonStyle = {
            classNames : classNames({
                'ui basic button':true,
                'disabled': this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'  || contentDetails.mode ==='markdownEdit' || this.props.TranslationStore.inTranslationMode
            }),
            iconSize : 'large',
            noTabIndex : this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit'  || contentDetails.mode ==='markdownEdit'
        } ;
        let editButton, markdownEditButton, saveButton, cancelButton, undoButton, redoButton;

        if ((contentDetails.mode === 'edit' || contentDetails.mode === 'markdownEdit') && this.props.UserProfileStore.username !== ''){
            //edit mode & logged UserProfileStore
            editButton = '';
            markdownEditButton = '';
            //ref="" --> we can't use string refs as they are legacy. ref={(refName)=>{this.refName=refName}}
            if(contentDetails.selector.stype === 'slide'){
                saveButton =
                    <button tabIndex="0"  className="ui button primary " onClick={this.handleSaveButtonClick.bind(this)} onChange={this.handleSaveButtonClick.bind(this)}>
                        <i className="large icons">
                            <i className="save icon "></i>
                            <i className=""></i>
                        </i>
                        Save{this.props.TranslationStore.inTranslationMode ? ' translation' : ''}
                    </button>;
                cancelButton =
                    <button tabIndex="0"  className="ui button " onClick={this.handleCancelButtonClick.bind(this, selector)} onChange={this.handleCancelButtonClick.bind(this, selector)}>
                        <i className="large icons">
                            <i className="cancel icon "></i>
                            <i className=""></i>
                        </i>
                        Cancel
                    </button>;
            } else {
                saveButton ='';
                cancelButton ='';
            }

            /*It were not displayed in master...but the code is prepared for it*/
            undoButton ='';
            redoButton ='';

            /* discomment when we want to see them
            undoButton =
                    <button tabIndex="0"  className="ui orange button " onClick={this.handleUndoButtonClick.bind(this)} onChange={this.handleUndoButtonClick.bind(this)}>
                         <i className="reply icon large"></i>
                    </button>;
            redoButton =
                    <button tabIndex="0"  className="ui orange button " onClick={this.handleRedoButtonClick.bind(this)} onChange={this.handleRedoButtonClick.bind(this)}>
                         <i className="mail forward icon large"></i>
                    </button>;
            */

        } else{ //No buttons
            if(this.props.UserProfileStore.username !== '') /* Edit button only visible if logged user*/
            {
                editButton =
                    <button className={editClass} onClick={this.handleEditButton.bind(this,selector)}
                        type="button"
                        aria-label={this.context.intl.formatMessage(this.messages.editButtonAriaText)}
                        tabIndex = {contentDetails.mode ==='edit'?-1:0}
                        >
                        <i className="icons">
                            <i className={'large blue ' + (this.props.TranslationStore.inTranslationMode ? 'translate' : 'edit') + ' icon'}></i>
                            <i className=""></i>
                        </i>
                        {this.context.intl.formatMessage(this.messages.editButtonText)}

                    </button>;

                if(contentDetails.selector.stype === 'slide' && this.props.DeckTreeStore.allowMarkdown){
                    markdownEditButton =
                        <button className={editClass} onClick={this.handleMarkdownEditButton.bind(this,selector)}
                            type="button"
                            aria-label={this.context.intl.formatMessage(this.messages.editButtonAriaText)}
                            tabIndex = {contentDetails.mode ==='markdownEdit'?-1:0}
                            >
                            <i className="icons">
                                <i className="large violet edit icon"></i>
                                <i className=""></i>
                            </i>
                            Markdown

                        </button>;
                }

            }
            saveButton ='';
            cancelButton ='';
            undoButton ='';
            redoButton ='';


        }
        /*
        <button className={viewClass} onClick={this.handleViewButton.bind(this,selector)}
          type="button"
          aria-label={this.context.intl.formatMessage(this.messages.viewButtonAriaText)}
          data-tooltip={this.context.intl.formatMessage(this.messages.viewButtonAriaText)}
          tabIndex = {contentDetails.mode ==='edit'?0:-1}
        >
          <i className="blue large unhide icon"></i>{this.context.intl.formatMessage(this.messages.viewButtonText)}
        </button>
        */
        let mobileMessage = <div className="ui top attached warning message">
          <p>You are viewing the mobile version of SlideWiki. If you wish to edit slides you will need to use the desktop version.</p>
        </div>;

        return (
                <div className="ui two column grid">
                    {this.props.TranslationStore.isLoading ? <div className="ui active dimmer"><div className="ui text loader">{this.context.intl.formatMessage(this.messages.loading)}</div></div> : ''}
                    <div className="column computer tablet only">
                        <div className="ui left floated top attached buttons" >
                            {editButton}
                            {markdownEditButton}
                            {saveButton}
                            {cancelButton}
                            {undoButton}
                            {redoButton}
                        </div>
                    </div>
                    <DeckTranslationsModal username={this.props.UserProfileStore.username} editPermissions={this.props.PermissionsStore.permissions.admin || this.props.PermissionsStore.permissions.edit} />
                    <div className="sixteen wide column mobile only" style={{marginTop: '-3rem'}}>
                        {mobileMessage}
                    </div>
                    <div className="column computer tablet only">
                    {this.props.UserProfileStore.username === '' ? '' :
                        <div className="ui right floated basic top attached buttons" >
                        <button className={addSlideClass} onClick={this.handleAddNode.bind(this, selector, {type: 'slide', id: '0'}) }
                            type="button"
                            aria-label={this.context.intl.formatMessage(this.messages.addSlideButtonAriaText)}
                            data-tooltip={this.context.intl.formatMessage(this.messages.addSlideButtonAriaText)}
                            tabIndex={this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit' || contentDetails.mode ==='markdownEdit' ?-1:0}>
                            <i className="large icons">
                                <i className="grey file text icon"></i>
                                <i className="inverted corner plus icon"></i>
                            </i>

                        </button>
                        <AttachSlides buttonStyle={buttonStyle} selector={selector} />
                        <button className={addDeckClass} onClick={this.handleAddNode.bind(this, selector, {type: 'deck', id: '0'})}
                            type="button"
                            aria-label={this.context.intl.formatMessage(this.messages.addDeckButtonAriaText)}
                            data-tooltip={this.context.intl.formatMessage(this.messages.addDeckButtonAriaText)}
                            tabIndex={this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit' || contentDetails.mode ==='markdownEdit' ?-1:0}>
                            <i className="large icons">
                                <i className="yellow folder icon"></i>
                                <i className="inverted corner plus icon"></i>
                            </i>
                        </button>
                        <AttachSubdeck buttonStyle={buttonStyle} selector={selector} />
                        <button className={duplicateItemClass} onClick={this.handleAddNode.bind(this, selector, {type: selector.stype, id: selector.sid})}
                            type="button"
                            aria-label={this.context.intl.formatMessage(this.messages.duplicateAriaText)}
                            data-tooltip={this.context.intl.formatMessage(this.messages.duplicateAriaText)}
                            tabIndex={contentDetails.selector.id === contentDetails.selector.sid || contentDetails.selector.stype==='deck' || this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit' || contentDetails.mode ==='markdownEdit' ?-1:0}>
                            <i className="grey large copy icon"></i>

                        </button>
                        <button className={deleteItemClass} onClick={this.handleDeleteNode.bind(this, selector)}
                            type="button"
                            aria-label={this.context.intl.formatMessage(this.messages.deleteAriaText)}
                            data-tooltip={this.context.intl.formatMessage(this.messages.deleteAriaText)}
                            tabIndex={contentDetails.selector.id === contentDetails.selector.sid || this.props.PermissionsStore.permissions.readOnly || !this.props.PermissionsStore.permissions.edit || contentDetails.mode ==='edit' || contentDetails.mode ==='markdownEdit' ?-1:0}>
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
            </div>
        );
    }
}
ContentActionsHeader.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};
//it should listen to decktree store in order to handle adding slides/decks
ContentActionsHeader = connectToStores(ContentActionsHeader, [DeckTreeStore, UserProfileStore, PermissionsStore, ContentStore, TranslationStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState(),
        ContentStore: context.getStore(ContentStore).getState(),
        TranslationStore: context.getStore(TranslationStore).getState()
    };
});
export default ContentActionsHeader;
