import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentUtil from '../../util/ContentUtil';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import RevisioningStore from '../../../../../stores/RevisioningStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import needsNewRevisionCheck from '../../../../../actions/revisioning/needsNewRevisionCheck';
import handleRevisionChanges from '../../../../../actions/revisioning/handleRevisionChanges';
import SlideContentEditor from './SlideContentEditor';
import Error from '../../../../../components/Error/Error';
const ReactDOM = require('react-dom');

class SlideEditPanel extends React.Component {
    handleAuth(selector) {
        const nodeURL = ContentUtil.makeNodeURL(selector, 'view');
        //user is not logged in
        if (this.props.UserProfileStore.username === '') {
            this.context.executeAction(navigateAction, {
                url: nodeURL
            });
        }
        return (<div>Sign-in needed!</div>);
    }
    render() {
        //make sure user is logged-in
        this.handleAuth(this.props.selector);
        //------------------we need to check the revisioning conditions
        //handle the notifications
        /*
        if(this.props.RevisioningStore.status.needs_revision){
            swal({
                title: 'New Revision Alert',
                text: 'This action will create new revisions for slide deck(s). Do you agree with creating the new revisions?',
                type: 'question',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes, make new revisions',
                confirmButtonClass: 'ui olive button',
                cancelButtonText: 'No',
                cancelButtonClass: 'ui red button',
                buttonsStyling: false
            }).then((accepted) => {
                //create the revision
                //this.context.dispatch('UPDATE_REVISIONING_STATUS', {status: {needs_revision: false}});
            }, (reason) => {
                //go back to view tab
                //this.context.dispatch('UPDATE_REVISIONING_STATUS', {status: {needs_revision: false}});
            });
        }else{
            const spath = this.props.selector.spath;
            let tmp = spath.split(';');
            let targetDeckID;
            if(tmp.length > 1){
                targetDeckID = tmp[tmp.length - 1];
                tmp = targetDeckID.split(':');
                targetDeckID = tmp[0];
            }else{
                //target is root deck
                targetDeckID = this.props.selector.id;
            }
            const userID =  this.props.UserProfileStore.userid;
            //check the revisioning condition
            this.context.executeAction(needsNewRevisionCheck, {
                deckID: targetDeckID,
                userID: userID
            });
        }
        */
        //-------------------------------------------------------
        let editorcontent = '';
        // Only load WYSIWYG-Editor when the content has been loaded via loadSlideEdit.js
        if (this.props.SlideEditStore.content !== ''){
            editorcontent = <SlideContentEditor title={this.props.SlideEditStore.title}
                                                content={this.props.SlideEditStore.content}
                                                id={this.props.SlideEditStore.id}
                                                speakernotes={this.props.SlideEditStore.speakernotes}
                                                selector={this.props.selector} />;
        }
        return (
            <div ref="slideEditPanel" className="ui bottom attached segment">
                {editorcontent}
            </div>
        );
    }
}

SlideEditPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

SlideEditPanel = connectToStores(SlideEditPanel, [SlideEditStore, UserProfileStore, RevisioningStore], (context, props) => {
    return {
        SlideEditStore: context.getStore(SlideEditStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        RevisioningStore: context.getStore(RevisioningStore).getState()
    };
});
export default SlideEditPanel;
