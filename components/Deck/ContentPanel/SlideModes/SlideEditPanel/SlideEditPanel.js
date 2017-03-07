import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import RevisioningStore from '../../../../../stores/RevisioningStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import SlideContentEditor from './SlideContentEditor';
import restoreDeckPageLayout from '../../../../../actions/deckpagelayout/restoreDeckPageLayout';
import swal from 'sweetalert2';



class SlideEditPanel extends React.Component {
    componentWillUnmount(){
        //show deckTree again
        context.executeAction(restoreDeckPageLayout,{});

    }

    render() {
        //------------------we need to check the revisioning conditions
        //handle the notifications --> in process.env.BROWSER
        let self = this;
        let newRevDIV = '';
        if(this.props.RevisioningStore.status.needs_revision){
            newRevDIV = <div className="ui info message"> <i className="ui info yellow circular icon"></i>Editing this slide will create a new revision of the container deck.</div>;
            /*
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
                self.context.dispatch('UPDATE_REVISIONING_STATUS', {status: {needs_revision: false}});
            }, (reason) => {
                //go back to view tab
                self.context.dispatch('UPDATE_REVISIONING_STATUS', {status: {needs_revision: false}});
            });
            */
        }
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
                {newRevDIV}
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
