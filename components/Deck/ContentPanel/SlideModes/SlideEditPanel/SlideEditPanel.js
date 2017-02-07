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
import ChartRender from '../../../util/ChartRender';
const ReactDOM = require('react-dom');
import restoreDeckPageLayout from '../../../../../actions/deckpagelayout/restoreDeckPageLayout';

class SlideEditPanel extends React.Component {
    componentWillUnmount() {
        //show deckTree again
        context.executeAction(restoreDeckPageLayout, {});

    }

    componentDidMount(){
        this.resize();
        // If there are some charts in the slide, render them.
        if ($("div[id^=chart]").length) this.forceUpdate();
    }

    componentDidUpdate(){
//        this.resize();
        if ($("div[id^=chart]").length) ChartRender.createCharts();
    }

    resize()
    {
        let containerwidth = document.getElementById('container').offsetWidth;
        let containerheight = document.getElementById('container').offsetHeight;
        //console.log('Component has been resized! Width =' + containerwidth + 'height' + containerheight);

        //reset scaling of pptx2html element to get original size
        $(".pptx2html").css({'transform': '', 'transform-origin': ''});

        //Function to fit contents in edit and view component
        let pptxwidth = $('.pptx2html').width();
        let pptxheight = $('.pptx2html').height();

        //only calculate scaleration for width for now
        this.scaleratio = containerwidth / pptxwidth;

        if ($('.pptx2html').length)
        {
            $(".pptx2html").css({'transform': '', 'transform-origin': ''});
            $(".pptx2html").css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});

            //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
            //width = pptxwidth + 40
            //height + 40
            //this.refs.slideViewPanel.style.width = ((pptxwidth + 40) * this.scaleratio) + 'px';
            //this.refs.slideViewPanel.style.padding = '20px 20px 20px 20px';
            //$(".pptx2html").css({'padding': '20px 20px 20px 20px'});
            //style.padding left = 20 px, top 20 px
            //this.refs.slideEditPanel.style.height = ((pptxheight + 0 + 20) * this.scaleratio) + 'px';

            $(".pptx2html").css({'borderStyle': 'none none double none ', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});
            //all borders
            //$(".pptx2html").css({'borderStyle': 'double double double double ', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});
        }
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
