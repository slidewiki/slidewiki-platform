import React from 'react';
import {NavLink} from 'fluxible-router';
import ContentUtil from '../util/ContentUtil';
import {connectToStores} from 'fluxible-addons-react';
import SlideControl from '../SlideModes/SlideControl';
import expandContentPanel from '../../../../actions/deckpagelayout/expandContentPanel';
import ReportModal from '../../../Report/ReportModal';
import openReportModal from '../../../../actions/report/openReportModal';
import SocialShare from '../../../Social/SocialShare';
import restoreDeckPageLayout from '../../../../actions/deckpagelayout/restoreDeckPageLayout';
import {Microservices} from '../../../../configs/microservices';
import ContentActionsFooterStore from '../../../../stores/ContentActionsFooterStore.js';
import likeActivity from '../../../../actions/activityfeed/likeActivity.js';
import addActivity from '../../../../actions/activityfeed/addActivity';
import incrementDeckViewCounter from '../../../../actions/activityfeed/incrementDeckViewCounter';
import dislikeActivity from '../../../../actions/activityfeed/dislikeActivity.js';
import UserProfileStore from '../../../../stores/UserProfileStore';
import ContentLikeStore from '../../../../stores/ContentLikeStore';
import DownloadModal from './DownloadModal';

class ContentActionsFooter extends React.Component {
    constructor(props) {
        super(props);
        //this.state={expanded: 0};
        this.state = this.props.ContentActionsFooterStore.state; //expanded: 0
        this.visible = true;
        // this.modal_classes = (this.visible) ? 'ui small modal transition visible active' : 'ui small modal transition hidden';
    }
    handleExpandClick(){
        this.context.executeAction(expandContentPanel, {});
        this.state.expanded = 1;
        return false;
    }
    handleCollapseClick(){
        this.context.executeAction(restoreDeckPageLayout, {});
        this.state.expanded = 0;
        return false;
    }
    getPresentationHref(){
        let presLocation = '/Presentation/' + this.props.ContentStore.selector.id + '/';
        if(!this.props.ContentStore.selector.subdeck){

            presLocation += this.props.ContentStore.selector.id + '/';
        }
        else{
            presLocation += this.props.ContentStore.selector.subdeck + '/';
        }
        if(this.props.ContentStore.selector.stype === 'slide'){
            // presLocation += this.props.ContentStore.selector.sid + '/';
            presLocation += this.props.ContentStore.selector.sid;// + '/';
        }
        return presLocation;
    }
    handlePresentationClick(e){
        if(process.env.BROWSER){
            e.preventDefault();
            window.open(this.getPresentationHref());
        }
    }

    /*
    getPrintHref(){
        return '/PresentationPrint/' + this.props.ContentStore.selector.id + '/?print-pdf';
    }
    handlePrintClick(e){
        if(process.env.BROWSER){
            e.preventDefault();
            window.open(this.getPrintHref());
        }
    }*/

    handlePrintClick(e){

        if(process.env.BROWSER){
            e.preventDefault();
            window.open(this.getExportHref('PDF'));
        }
        this.createDownloadActivity();
    }

    getExportHref(type){
        if (type !== 'PDF') {//only for print now
            return;
        }
        if (this.props.ContentStore.selector.id !== undefined && this.props.ContentStore.selector.id !== '' && this.props.ContentStore.selector.id !== 0)
        {
            //console.log(this.props.ContentStore.selector.id);
            let splittedId =  this.props.ContentStore.selector.id.split('-'); //separates deckId and revision
            let pdfHref = Microservices.pdf.uri + '/export' + type + '/' + splittedId[0];

            return pdfHref;
        }
        else
        {
            // in adddeck this.props.ContentStore.selector.id is 0
            return Microservices.pdf.uri + '/export' + type + '/';
        }
    }



    createDownloadActivity() {
        //create new activity
        let splittedId =  this.props.ContentStore.selector.id.split('-'); //separates deckId and revision
        let userId = String(this.props.UserProfileStore.userid);
        if (userId === '') {
            userId = '0';//Unknown - not logged in
        }
        let activity = {
            activity_type: 'download',
            user_id: userId,
            content_id: splittedId[0],
            content_kind: 'deck'
        };
        this.context.executeAction(addActivity, {activity: activity});
        context.executeAction(incrementDeckViewCounter, {type: 'download'});
    }

    handleLikeClick(e){
        if (this.props.ContentLikeStore.usersWhoLikedDeck.indexOf(String(this.props.UserProfileStore.userid)) !== -1) {
            this.props.ContentLikeStore.usersWhoLikedDeck.splice(this.props.ContentLikeStore.usersWhoLikedDeck.indexOf(String(this.props.UserProfileStore.userid)),1);
            // dislike activity
            this.context.executeAction(dislikeActivity, {
                selector: this.props.ContentStore.selector,
                userid: this.props.UserProfileStore.userid
            });
        } else {
            this.props.ContentLikeStore.usersWhoLikedDeck.push(String(this.props.UserProfileStore.userid));
            this.context.executeAction(likeActivity, {
                selector: this.props.ContentStore.selector,
                userid: this.props.UserProfileStore.userid,
                username: this.props.UserProfileStore.username
            });
        }
    }

    render() {
        let likeButton = 'ui button';
        let classNameLikeButton = 'thumbs up alternate large icon';
        let tooltipLikeButton = 'Like this deck';
        if (this.props.UserProfileStore.userid === '') {
            //undefined user
            likeButton = 'ui disabled button';
        } else if (this.props.ContentLikeStore.usersWhoLikedDeck.indexOf(String(this.props.UserProfileStore.userid)) !== -1) {
            //already liked
            classNameLikeButton = 'thumbs up alternate large blue icon';
            tooltipLikeButton = 'Dislike this deck';
        }

        return (
            <div className="ui">
                <div className="ui teal top attached progress slide-progress-bar" ref="slide-progressbar">
                    {this.props.ContentStore.selector.stype === 'slide' ? <div className="bar"></div> : ''}
                </div>
                <div className="ui bottom attached tabular menu" style={{'background': '#DCDDDE'}}>
                    {this.props.ContentStore.selector.stype === 'slide' ? <SlideControl mode={this.props.ContentStore.mode}/> : ''}
                    <div className="right menu">
                        <div className="ui icon buttons large right floated">

                            <NavLink onClick={this.handlePresentationClick.bind(this)} href={this.getPresentationHref()} target="_blank">
                                <button className="ui button" type="button" aria-label="Open slideshow in new tab" data-tooltip="Open slideshow in new tab">
                                    <i className="circle play large icon"></i>
                                </button>
                            </NavLink>

                           <NavLink onClick={this.handlePrintClick.bind(this)} href={this.getExportHref('PDF')} target="_blank">
                            <button className="ui button" type="button" aria-label="Download PDF version for printing" data-tooltip="Download PDF version for printing" >
                                <i className="print large icon"></i>
                            </button>
                            </NavLink>
                            <DownloadModal/>
                            <ReportModal/>
                            <SocialShare userid={this.props.UserProfileStore.userid} selector={this.props.ContentStore.selector} />
                            <button className={likeButton} type="button" aria-label={tooltipLikeButton} data-tooltip={tooltipLikeButton} onClick={this.handleLikeClick.bind(this)}>
                                <i className={classNameLikeButton}></i>
                            </button>
                            {/* {this.state.expanded ? <button className="ui button" onClick={this.handleCollapseClick.bind(this)} title="Reset Layout"><i className="large icon compress"></i></button> : <button className="ui button" onClick={this.handleExpandClick.bind(this)} title="Expand Content"><i className="large icon expand"></i></button>} */}
                            {this.state.expanded ? <button className="ui button" onClick={this.handleCollapseClick.bind(this)}  aria-label="Reset Layout" data-tooltip="Reset Layout"><i className="large icon compress"></i></button> : <button className="ui button" onClick={this.handleExpandClick.bind(this)} aria-label="Expand Content" data-tooltip="Expand Content"><i className="large icon expand"></i></button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ContentActionsFooter.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

ContentActionsFooter = connectToStores(ContentActionsFooter, [ContentActionsFooterStore, UserProfileStore, ContentLikeStore], (context, props) => {
    return {
        ContentActionsFooterStore: context.getStore(ContentActionsFooterStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        ContentLikeStore: context.getStore(ContentLikeStore).getState()
    };
});
export default ContentActionsFooter;
