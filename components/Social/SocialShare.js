import React from 'react';
import {ShareButtons, generateShareIcon} from 'react-share';
import addActivity from '../../actions/activityfeed/addActivity';
import MailShareModal from './MailShareModal';

class SocialShare extends React.Component {

    componentDidMount(){
        $(this.refs.shareDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false});
    }

    componentDidUpdate() {
        $(this.refs.shareDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false});
    }

    onEnterAndClick(text, value) {
        $(this.refs.shareDropDown).dropdown('hide');
        return false;
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
        context.executeAction(addActivity, {activity: activity});
    }

    render() {
        let shareUrl = '';
        if (typeof window !== 'undefined') {
            shareUrl = window.location.href;
        }

        const {
            FacebookShareButton,
            GooglePlusShareButton,
            LinkedinShareButton,
            TwitterShareButton
        } = ShareButtons;
        const FacebookIcon = generateShareIcon('facebook');
        const TwitterIcon = generateShareIcon('twitter');
        const GooglePlusIcon = generateShareIcon('google');
        const LinkedinIcon = generateShareIcon('linkedin');

        const shareMessage = 'I have found a very interesting ' + this.props.selector.stype + ', here on SlideWiki.';

        return(
            <div className="ui dropdown" ref="shareDropDown" role="button" aria-haspopup="true" aria-label="Share" data-tooltip="Share">
                <div className="text">
                    <button className="ui button" type="button" >
                        <i className="share alternate large icon" />
                    </button>
                </div>
                <div className="menu" role="menu" >
                    <MailShareModal userid={this.props.userid} selector={this.props.selector} />

                    <div className="item" data-value="Twitter" role="menuitem" aria-label="Twitter" data-tooltip="Twitter" tabIndex="0" onClick={this.handleTwitterClick.bind(this)}>
                        <TwitterShareButton
                            url={shareUrl}
                            title={shareMessage}
                            className="Demo__some-network__share-button">
                            <TwitterIcon
                                size={33}
                                round />
                        </TwitterShareButton>
                    </div>
                    <div className="item" data-value="Facebook" role="menuitem" aria-label="Facebook" data-tooltip="Facebook" tabIndex="0" onClick={this.handleFacebookClick.bind(this)}>
                        <FacebookShareButton
                            url={shareUrl}
                            title={shareMessage}
                            className="Demo__some-network__share-button">
                            <FacebookIcon
                                size={33}
                                round />
                        </FacebookShareButton>
                    </div>
                    <div className="item" data-value="GooglePlus" role="menuitem" aria-label="GooglePlus" data-tooltip="Google Plus" tabIndex="0" onClick={this.handleGooglePlusClick.bind(this)}>
                        <GooglePlusShareButton
                            url='http://localhost:3000/deck/1602-1/slide/11974-1/11974-1:1/view'
                            content={shareMessage}
                            className="Demo__some-network__share-button">
                            <GooglePlusIcon
                                size={33}
                                round />
                        </GooglePlusShareButton>
                    </div>
                    <div className="item" data-value="LinkedIn" role="menuitem" aria-label="LinkedIn" data-tooltip="LinkedIn" tabIndex="0" onClick={this.handleLinkedinClick.bind(this)}>
                        <LinkedinShareButton
                            url={shareUrl}
                            title={shareMessage + '(' + shareUrl + ')'}
                            windowWidth={750}
                            windowHeight={600}
                            className="Demo__some-network__share-button">
                            <LinkedinIcon
                                size={33}
                                round />
                        </LinkedinShareButton>
                    </div>
                </div>
            </div>
        );
    }
}

SocialShare.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SocialShare;
