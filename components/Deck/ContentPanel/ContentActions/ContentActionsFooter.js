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
import deleteFollowing from '../../../../actions/following/deleteFollowing.js';
import createFollowing from '../../../../actions/following/createFollowing.js';
import addActivity from '../../../../actions/activityfeed/addActivity';
import incrementDeckViewCounter from '../../../../actions/activityfeed/incrementDeckViewCounter';
import dislikeActivity from '../../../../actions/activityfeed/dislikeActivity.js';
import UserProfileStore from '../../../../stores/UserProfileStore';
import ContentLikeStore from '../../../../stores/ContentLikeStore';
import UserFollowingsStore from '../../../../stores/UserFollowingsStore';
import DownloadModal from './DownloadModal';
import MobileDetect from 'mobile-detect';
import AriaMenuButton from 'react-aria-menubutton';
import TranslationStore from '../../../../stores/TranslationStore';
import { makeNodeURL } from '../../../common/Util';
import {Icon} from 'semantic-ui-react';
import {defineMessages} from 'react-intl';

class ContentActionsFooter extends React.Component {
    constructor(props) {
        super(props);
        //this.state={expanded: 0};
        this.state = this.props.ContentActionsFooterStore.state; //expanded: 0
        this.visible = true;
        this.state.isMobile = false;
        // this.modal_classes = (this.visible) ? 'ui small modal transition visible active' : 'ui small modal transition hidden';
        this.messages = defineMessages({
            followButtonText:{
                id: 'ContentActionsFooter.followButtonText',
                defaultMessage:'Subscribe to this deck'
            },
            followButtonTextAlternate:{
                id: 'ContentActionsFooter.followButtonTextAlternate',
                defaultMessage:'You are subscribed to this deck, click to unsubscribe'
            },
            likeButtonText:{
                id: 'ContentActionsFooter.likeButtonText',
                defaultMessage:'Like this deck'
            },
            likeButtonTextAlternate:{
                id: 'ContentActionsFooter.likeButtonTextAlternate',
                defaultMessage:'Dislike this deck'
            },
            printText:{
                id: 'ContentActionsFooter.printText',
                defaultMessage:'Print'
            },
            slideshowText:{
                id: 'ContentActionsFooter.slideshowText',
                defaultMessage:'Open Slideshow'
            },
            likeText:{
                id: 'ContentActionsFooter.likeText',
                defaultMessage:'Like'
            },
            subscribeText:{
                id: 'ContentActionsFooter.subscribeText',
                defaultMessage:'Subscribe'
            }
        });
    }

    componentDidMount(){
        let userAgent = window.navigator.userAgent;
        let mobile = new MobileDetect(userAgent);
        this.setState({isMobile: (mobile.phone() !== null) ? true : false});
        document.addEventListener('keydown', this.handleKeyDown);        
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
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

    handleFollowClick(e){
        if (this.props.UserFollowingsStore.selectedFollowingId !== null) {
            this.context.executeAction(deleteFollowing, {
                id: this.props.UserFollowingsStore.selectedFollowingId
            });
        } else {
            this.context.executeAction(createFollowing, {
                selector: this.props.ContentStore.selector,
                userId: this.props.UserProfileStore.userid,
                followed_type: 'deck'
            });
        }
    }

    handleKeyDown = (e) => {
        if (e.altKey && e.keyCode === 83) { //s    
            window.open(makeNodeURL(this.props.ContentStore.selector, 'presentation', undefined, this.props.deckSlug, this.props.TranslationStore.currentLang), '_blank');
        }
    }

    render() {
        let likeButton = 'ui button';
        let followButton = 'ui button';
        let likeDisabled = '';
        let followDisabled = '';
        let classNameLikeButton = 'thumbs up alternate large icon';
        let iconFollowButton = <Icon size='large' name='rss' />;
        let tooltipFollowButton = this.context.intl.formatMessage(this.messages.followButtonText);
        let tooltipLikeButton = this.context.intl.formatMessage(this.messages.likeButtonText);
        if (this.props.UserProfileStore.userid === '') {
            //undefined user
            likeButton = 'ui disabled button';
            followButton = 'ui disabled button';
            likeDisabled = 'disabled';
            followDisabled = 'disabled';
        } else {
            if (this.props.ContentLikeStore.usersWhoLikedDeck.indexOf(String(this.props.UserProfileStore.userid)) !== -1) {
                //already liked
                classNameLikeButton = 'thumbs up alternate large blue icon';
                tooltipLikeButton = this.context.intl.formatMessage(this.messages.likeButtonTextAlternate);
            }

            if (this.props.UserFollowingsStore.selectedFollowingId !== null) {//IS USER FOLLOWING THIS DECK
                iconFollowButton = <Icon size='large' name='rss' color='blue' />;
                tooltipFollowButton = this.context.intl.formatMessage(this.messages.followButtonTextAlternate);
            }
        }

        let desktopButtons = <div>
          <a href={makeNodeURL(this.props.ContentStore.selector, 'print', undefined, this.props.deckSlug, this.props.TranslationStore.currentLang)} target="_blank" tabIndex="-1">
          <button className="ui button" type="button" aria-label={this.context.intl.formatMessage(this.messages.printText)} data-tooltip={this.context.intl.formatMessage(this.messages.printText)} >
              <i className="print large icon"></i>
          </button>
          </a>
          <DownloadModal/>
          <ReportModal/>
          <button className={likeButton} type="button" aria-label={tooltipLikeButton} data-tooltip={tooltipLikeButton} onClick={this.handleLikeClick.bind(this)} disabled={likeDisabled}>
              <i className={classNameLikeButton}></i>
          </button>
          <button className={followButton} type="button" aria-label={tooltipFollowButton} data-tooltip={tooltipFollowButton} onClick={this.handleFollowClick.bind(this)} disabled={followDisabled}>
              {iconFollowButton}
          </button>
          <SocialShare userid={this.props.UserProfileStore.userid} selector={this.props.ContentStore.selector}
                embedPresentationHref={makeNodeURL(this.props.ContentStore.selector, 'presentation', undefined, this.props.deckSlug, this.props.TranslationStore.currentLang)}/>
          </div>;

        let listStyle = {
            listStyle: 'none'
        };

        let mobileButtons = <AriaMenuButton.Wrapper>
            <AriaMenuButton.Button >
             <div style={{'display': 'inline-flex'}}>
               <i className="ui ellipsis vertical large grey icon" style={{'marginTop':'0.6em'}}></i>
              </div>
            </AriaMenuButton.Button>
            <AriaMenuButton.Menu className='ui menu vertical'
             style={{'position':'absolute', 'zIndex':'3', 'right':'0px', 'display': 'flex !important', 'width': '50%'}} >
                 <AriaMenuButton.MenuItem key= {0} tag='li' style={listStyle}>
                   <a href={makeNodeURL(this.props.ContentStore.selector, 'print', undefined, this.props.deckSlug, this.props.TranslationStore.currentLang)} target="_blank" className='item'>
                    <div aria-label={this.context.intl.formatMessage(this.messages.printText)} data-tooltip={this.context.intl.formatMessage(this.messages.printText)} >
                        <i className="print large icon"></i> {this.context.intl.formatMessage(this.messages.printText)}
                    </div>
                    </a>
                 </AriaMenuButton.MenuItem>
                 <AriaMenuButton.MenuItem key= {1} tag='li' style={listStyle}>
                   <DownloadModal textOnly={true} className='item'/>
                 </AriaMenuButton.MenuItem>
                 <AriaMenuButton.MenuItem key= {2} tag='li' style={listStyle}>
                   <ReportModal textOnly={true} className='item'/>
                 </AriaMenuButton.MenuItem>
                 <AriaMenuButton.MenuItem key= {3} tag='li' style={listStyle}>
                   <SocialShare userid={this.props.UserProfileStore.userid} selector={this.props.ContentStore.selector} textOnly={true} className='item'/>
                 </AriaMenuButton.MenuItem>
                 <AriaMenuButton.MenuItem key= {4} tag='li' style={listStyle}>
                   <div className='item' aria-label={tooltipLikeButton} data-tooltip={tooltipLikeButton} onClick={this.handleLikeClick.bind(this)}>
                       <span><i className={classNameLikeButton}></i>{this.context.intl.formatMessage(this.messages.likeText)}</span>
                   </div>
                 </AriaMenuButton.MenuItem>
                 <AriaMenuButton.MenuItem key= {5} tag='li' style={listStyle}>
                   <div className='item' aria-label={tooltipFollowButton} data-tooltip={tooltipFollowButton} onClick={this.handleFollowClick.bind(this)}>
                       <span>{iconFollowButton}{this.context.intl.formatMessage(this.messages.subscribeText)}</span>
                   </div>
                 </AriaMenuButton.MenuItem>
             </AriaMenuButton.Menu>
         </AriaMenuButton.Wrapper>;

        return (
            <div className="ui">
                <div className="ui teal top attached progress slide-progress-bar" ref="slide-progressbar">
                    {this.props.ContentStore.selector.stype === 'slide' ? <div className="bar"></div> : ''}
                </div>
                <div className="ui bottom attached tabular menu" style={{'background': '#e0e1e2'}}>
                    {this.props.ContentStore.selector.stype === 'slide' ? <SlideControl mode={this.props.ContentStore.mode} isMobile={this.state.isMobile}/> : (this.state.isMobile) ? <SlideControl mode={this.props.ContentStore.mode} isMobile={this.state.isMobile}/> : ''}
                    <div className="right menu" >
                        <div className="ui icon buttons large right floated">
                            <a id="PresentationNewWindow" href={makeNodeURL(this.props.ContentStore.selector, 'presentation', undefined, this.props.deckSlug, this.props.TranslationStore.currentLang)} target="_blank" tabIndex="-1">
                                <button className="ui button" type="button" aria-label={this.context.intl.formatMessage(this.messages.slideshowText)} data-speech-id="openSlideshow" data-tooltip={this.context.intl.formatMessage(this.messages.slideshowText)}>
                                    <i className="circle play large icon"></i>
                                </button>
                            </a>

                            {!this.state.isMobile ? desktopButtons : ''}
                        </div>
                        {!this.state.isMobile ? '' : mobileButtons}
                    </div>
                </div>
            </div>
        );
    }
}

ContentActionsFooter.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

ContentActionsFooter = connectToStores(ContentActionsFooter, [ContentActionsFooterStore, UserProfileStore, ContentLikeStore, TranslationStore, UserFollowingsStore], (context, props) => {
    return {
        ContentActionsFooterStore: context.getStore(ContentActionsFooterStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        ContentLikeStore: context.getStore(ContentLikeStore).getState(),
        TranslationStore: context.getStore(TranslationStore).getState(),
        UserFollowingsStore: context.getStore(UserFollowingsStore).getState()
    };
});
export default ContentActionsFooter;
