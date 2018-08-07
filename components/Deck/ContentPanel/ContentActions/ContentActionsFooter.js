import PropTypes from 'prop-types';
import React from 'react';
import {NavLink} from 'fluxible-router';
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
import MobileDetect from 'mobile-detect';
import AriaMenuButton from 'react-aria-menubutton';
import TranslationStore from '../../../../stores/TranslationStore';
import { makeNodeURL } from '../../../common/Util';

class ContentActionsFooter extends React.Component {
    constructor(props) {
        super(props);
        //this.state={expanded: 0};
        this.state = this.props.ContentActionsFooterStore.state; //expanded: 0
        this.visible = true;
        this.state.isMobile = false;
        // this.modal_classes = (this.visible) ? 'ui small modal transition visible active' : 'ui small modal transition hidden';
    }

    componentDidMount(){
        let userAgent = window.navigator.userAgent;
        let mobile = new MobileDetect(userAgent);
        this.setState({isMobile: (mobile.phone() !== null) ? true : false});
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

        let desktopButtons = <div>
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
          </div>;

        let mobileButtons = <AriaMenuButton.Wrapper>
            <AriaMenuButton.Button >
             <div style={{'display': 'inline-flex'}}>
               <i className="ui ellipsis vertical large icon" style={{'marginTop':'0.7em'}}></i>
              </div>
            </AriaMenuButton.Button>
            <AriaMenuButton.Menu className='ui menu vertical'
             style={{'position':'absolute', 'zIndex':'1', 'right':'0px', 'display': 'flex !important', 'width': '50%'}} >
                 <AriaMenuButton.MenuItem className='item' key= {0} tag='li'>
                   <NavLink onClick={this.handlePrintClick.bind(this)} href={this.getExportHref('PDF')} target="_blank" style={{'color': 'black'}}>
                    <div aria-label="Download PDF version for printing" data-tooltip="Download PDF version for printing" >
                        <i className="print large icon"></i>
                        Print
                    </div>
                    </NavLink>
                 </AriaMenuButton.MenuItem>
                 <AriaMenuButton.MenuItem className='item' key= {1} tag='li'>
                   <DownloadModal textOnly={true}/>
                 </AriaMenuButton.MenuItem>
                 <AriaMenuButton.MenuItem className='item' key= {2} tag='li'>
                   <ReportModal textOnly={true}/>
                 </AriaMenuButton.MenuItem>
                 <AriaMenuButton.MenuItem className='item' key= {3} tag='li'>
                   <SocialShare userid={this.props.UserProfileStore.userid} selector={this.props.ContentStore.selector} textOnly={true}/>
                 </AriaMenuButton.MenuItem>
                 <AriaMenuButton.MenuItem className='item' key= {4} tag='li'>
                   <div aria-label={tooltipLikeButton} data-tooltip={tooltipLikeButton} onClick={this.handleLikeClick.bind(this)}>
                       <i className={classNameLikeButton}></i> Like
                   </div>
                 </AriaMenuButton.MenuItem>
             </AriaMenuButton.Menu>
         </AriaMenuButton.Wrapper>;

        return (
            <div className="ui">
                <div className="ui teal top attached progress slide-progress-bar" ref="slide-progressbar">
                    {this.props.ContentStore.selector.stype === 'slide' ? <div className="bar"></div> : ''}
                </div>
                <div className="ui bottom attached tabular menu" style={{'background': '#DCDDDE'}}>
                    {this.props.ContentStore.selector.stype === 'slide' ? <SlideControl mode={this.props.ContentStore.mode} isMobile={this.state.isMobile}/> : (this.state.isMobile) ? <SlideControl mode={this.props.ContentStore.mode} isMobile={this.state.isMobile}/> : ''}
                    <div className="right menu">
                        <div className="ui icon buttons large right floated">

                            <a href={makeNodeURL(this.props.ContentStore.selector, 'presentation', undefined, this.props.deckSlug, this.props.TranslationStore.currentLang)} target="_blank">
                                <button className="ui button" type="button" aria-label="Open slideshow in new tab" data-tooltip="Open slideshow in new tab">
                                    <i className="circle play large icon"></i>
                                </button>
                            </a>

                            {!this.state.isMobile ? desktopButtons : ''}

                            {/* {this.state.expanded ? <button className="ui button" onClick={this.handleCollapseClick.bind(this)} title="Reset Layout"><i className="large icon compress"></i></button> : <button className="ui button" onClick={this.handleExpandClick.bind(this)} title="Expand Content"><i className="large icon expand"></i></button>} */}
                            {/* below is temporary fix (disable) for SWIK-1996 - When expand screen (hide decktree) on slide edit, then no content is displayed
                                this.state.expanded ? <button className="ui button" onClick={this.handleCollapseClick.bind(this)}  aria-label="Reset Layout" data-tooltip="Reset Layout"><i className="large icon compress"></i></button> : <button className="ui button" onClick={this.handleExpandClick.bind(this)} aria-label="Expand Content" data-tooltip="Expand Content"><i className="large icon expand"></i></button>*/}
                        </div>
                        {!this.state.isMobile ? '' : mobileButtons}
                    </div>
                </div>
            </div>
        );
    }
}

ContentActionsFooter.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

ContentActionsFooter = connectToStores(ContentActionsFooter, [ContentActionsFooterStore, UserProfileStore, ContentLikeStore, TranslationStore], (context, props) => {
    return {
        ContentActionsFooterStore: context.getStore(ContentActionsFooterStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        ContentLikeStore: context.getStore(ContentLikeStore).getState(),
        TranslationStore: context.getStore(TranslationStore).getState()
    };
});
export default ContentActionsFooter;
