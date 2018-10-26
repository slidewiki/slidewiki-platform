import PropTypes from 'prop-types';
import React from 'react';
import {ShareButtons, generateShareIcon} from 'react-share';
import addActivity from '../../actions/activityfeed/addActivity';
import incrementDeckViewCounter from '../../actions/activityfeed/incrementDeckViewCounter';
import EmbedModal from '../Deck/ContentPanel/ContentActions/EmbedModal';
import {Button, Container, Form, Modal, Icon, Segment, Grid, TextArea, Input, Label} from 'semantic-ui-react';
import { isEmpty } from '../../common.js';

class SocialShare extends React.Component {

    componentDidMount(){
        this.initDropdown();
    }

    componentDidUpdate() {
        this.initDropdown();
    }
    
    initDropdown() {
        $(this.refs.shareDropDown).dropdown({
            action: this.onClick.bind(this), 
            selectOnKeydown: false, 
            allowTab: false, // prevent tabindex on menu items
            keys: {
                enter: false, // prevent event listener on enter since enters are handled by 'react-share'
                upArrow: false, 
                downArrow: false
            }
        });
    }

    onClick(text, value) {
        $(this.refs.shareDropDown).dropdown('hide');
        
        return false;
    }

    handleEmbedClick(){
//        this.createShareActivity('Embed');
    }

    handleEmailClick(){
        this.createShareActivity('E-mail');
    }

    handleTwitterClick(){
        this.createShareActivity('Twitter');
    }

    handleFacebookClick(){
        this.createShareActivity('Facebook');
    }

    handleGooglePlusClick(){
        this.createShareActivity('GooglePlus');
    }

    handleLinkedinClick(){
        this.createShareActivity('Linkedin');
    }

    createShareActivity(platform) {
        let userId = String(this.props.userid);
        if (userId === '') {
            userId = '0';//Unknown - not logged in
        }
        // Add new activity
        let activity = {
            activity_type: 'share',
            user_id: userId,
            content_id: this.props.selector.sid,
            content_kind: this.props.selector.stype,
            share_info: {
                platform: platform
            }
        };
        const contentRootId = this.props.selector.id;
        if (!isEmpty(contentRootId)) {
            activity.content_root_id = contentRootId;
        }
        
        context.executeAction(addActivity, {activity: activity});
        context.executeAction(incrementDeckViewCounter, {type: 'share'});
    }

    render() {
        const iconSize = 33;
        let shareUrl = '';
        if (typeof window !== 'undefined') {
            shareUrl = window.location.href;
        }

        const {
            FacebookShareButton,
            GooglePlusShareButton,
            LinkedinShareButton,
            TwitterShareButton,
            EmailShareButton
        } = ShareButtons;
        const FacebookIcon = generateShareIcon('facebook');
        const TwitterIcon = generateShareIcon('twitter');
        const GooglePlusIcon = generateShareIcon('google');
        const LinkedinIcon = generateShareIcon('linkedin');
        const EmailIcon = generateShareIcon('email');

        const shareMessage = 'I have found a very interesting ' + this.props.selector.stype + ', here on SlideWiki.';
        const emailShareMessage = 'Hi.\nI have found a very interesting ' + this.props.selector.stype + ', here on SlideWiki.\n' + shareUrl;
        const emailShareSubject = 'Interesting ' + this.props.selector.stype + ' on SlideWiki';
        
        const dropdownStyle = this.props.textOnly ? {
            width: '100%'
        } : {};
        
        const dropdownMenuStyle =  this.props.textOnly ? {
            left: 20, 
            right: 'auto'
        } : {};
        
        return(
            <div className="ui dropdown" ref="shareDropDown" role="button" aria-haspopup="true" aria-label="Share" data-tooltip="Share" style={dropdownStyle}>
                { !this.props.textOnly ?
                    <div className="text">
                        <button className="ui button" type="button" role="listbox">
                            <i className="share alternate large icon" />
                        </button>
                    </div>
                    :
                    <div className={this.props.className} aria-label="Share" data-tooltip="Share">
                        <span><Icon name='share' size='large'/> Share</span>
                    </div>
                }
            
                <div className="menu" role="menu" style={dropdownMenuStyle}>
                    <div className="item" data-value="E-mail" data-tooltip="E-mail" onClick={this.handleEmailClick.bind(this)}>
                        <EmailShareButton
                            url={shareUrl}
                            subject={emailShareSubject}
                            body={emailShareMessage}
                            additionalProps={{'aria-label': 'E-mail', 'role': 'menuitem'}}
                            className="Demo__some-network__share-button">
                            <EmailIcon
                                size={iconSize}
                                round />
                        </EmailShareButton>
                    </div>
                    <div className="item" data-value="Twitter" data-tooltip="Twitter" onClick={this.handleTwitterClick.bind(this)}>
                        <TwitterShareButton
                            url={shareUrl}
                            title={shareMessage}
                            additionalProps={{'aria-label': 'Twitter', 'role': 'menuitem'}}
                            className="Demo__some-network__share-button">
                            <TwitterIcon
                                size={iconSize}
                                round />
                        </TwitterShareButton>
                    </div>
                    {/*}<div className="item" data-value="Facebook" role="menuitem" aria-label="Facebook" data-tooltip="Facebook" tabIndex="0" onClick={this.handleFacebookClick.bind(this)}>
                        <FacebookShareButton
                            url={shareUrl}
                            quote={shareMessage}
                            className="Demo__some-network__share-button">
                            <FacebookIcon
                                size={iconSize}
                                round />
                        </FacebookShareButton>
                    </div>*/}
                    <div className="item" data-value="GooglePlus" data-tooltip="Google Plus" onClick={this.handleGooglePlusClick.bind(this)}>
                        <GooglePlusShareButton
                            url={shareUrl}
                            content={shareMessage}
                            additionalProps={{'aria-label': 'GooglePlus', 'role': 'menuitem'}}
                            className="Demo__some-network__share-button">
                            <GooglePlusIcon
                                size={iconSize}
                                round />
                        </GooglePlusShareButton>
                    </div>
                    <div className="item" data-value="LinkedIn" data-tooltip="LinkedIn" onClick={this.handleLinkedinClick.bind(this)}>
                        <LinkedinShareButton
                            url={shareUrl}
                            title={shareMessage + '(' + shareUrl + ')'}
                            windowWidth={750}
                            windowHeight={600}
                            additionalProps={{'aria-label': 'LinkedIn', 'role': 'menuitem'}}
                            className="Demo__some-network__share-button">
                            <LinkedinIcon
                                size={iconSize}
                                round />
                        </LinkedinShareButton>
                    </div>
                    <EmbedModal size={iconSize} fontSize={14} color="white" backgroundColor="#1e78bb"
                            embedPresentationHref={this.props.embedPresentationHref}/>
                </div>
            </div>
        );
    }
}

SocialShare.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default SocialShare;
