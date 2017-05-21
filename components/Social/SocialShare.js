import React from 'react';
import {ShareButtons, generateShareIcon} from 'react-share';
import MailShareModal from './MailShareModal';

class SocialShare extends React.Component {

    componentDidMount(){
        $(this.refs.shareDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false});
        // $(this.refs.shareTwitter).on('click', this.handleTwitterClick());

    }

    componentDidUpdate() {
        $(this.refs.shareDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false});
        // $(this.refs.shareTwitter).on('click', this.handleTwitterClick());

    }

    getTargetDeckId() {
        const selector = this.props.selector;
        let targetDeckId = 0;
        if (selector.stype === 'deck') {
            targetDeckId = selector.sid;
        } else if (selector.stype === 'slide') {
            let tmp = selector.spath.split(';');
            if (tmp.length > 1) {
                targetDeckId = tmp[tmp.length - 2];
                tmp = targetDeckId.split(':');
                targetDeckId = tmp[0];
            } else {
                targetDeckId = selector.id;
            }
        }
        return targetDeckId;
    }

    onEnterAndClick(text, value) {
        // console.log('onEnterAndClick', text + '-' + value);
        $(this.refs.shareDropDown).dropdown('hide');
        return false;
    }

    handleMailClick(){
        console.log('handleMailClick');

        //Share by email

        //createShareActivity('Twitter');
    }

    handleTwitterClick(){
        console.log('handleTwitterClick');
        //createShareActivity('Twitter');
    }

    handleFacebookClick(){
        console.log('handleFacebookClick');
        //createShareActivity('Facebook');
    }

    handleGooglePlusClick(){
        console.log('handleG+Click');
        //createShareActivity('GooglePlus');
    }

    handleLinkedinClick(){
        console.log('handleLinkedinClick');
        //createShareActivity('Linkedin');
    }

    createShareActivity(platform) {
        // Add new activity
        let activity = {
            activity_type: 'share',
            user_id: String(this.props.userid),
            content_id: this.getTargetDeckId(),
            content_kind: 'deck',
            share_info: {
                platform: platform
            }
        };
        context.executeAction(addActivity, {activity: activity});
    }

    render() {
        const shareUrl = 'https://stable.slidewiki.org/deck/' + this.getTargetDeckId();
        const {
            FacebookShareButton,
            GooglePlusShareButton,
            LinkedinShareButton,
            TwitterShareButton,
            TelegramShareButton,
            WhatsappShareButton,
            PinterestShareButton,
            VKShareButton,
            OKShareButton
        } = ShareButtons;
        const FacebookIcon = generateShareIcon('facebook');
        const TwitterIcon = generateShareIcon('twitter');
        const GooglePlusIcon = generateShareIcon('google');
        const LinkedinIcon = generateShareIcon('linkedin');

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
                            title="I have found a very interesting deck, here on SlideWiki."
                            className="Demo__some-network__share-button">
                            <TwitterIcon
                                size={32}
                                round />
                        </TwitterShareButton>
                    </div>
                    <div className="item" data-value="Facebook" role="menuitem" aria-label="Facebook" data-tooltip="Facebook" tabIndex="0" onClick={this.handleFacebookClick.bind(this)}>
                        <FacebookShareButton
                            url={shareUrl}
                            title='I have found a very interesting deck, here on SlideWiki.'
                            className="Demo__some-network__share-button">
                            <FacebookIcon
                                size={32}
                                round />
                        </FacebookShareButton>
                    </div>
                    <div className="item" data-value="GooglePlus" role="menuitem" aria-label="GooglePlus" data-tooltip="Google Plus" tabIndex="0" onClick={this.handleGooglePlusClick.bind(this)}>
                        <GooglePlusShareButton
                            url={shareUrl}
                            content='I have found a very interesting deck, here on SlideWiki.'
                            className="Demo__some-network__share-button">
                            <GooglePlusIcon
                                size={32}
                                round />
                        </GooglePlusShareButton>
                    </div>
                    <div className="item" data-value="LinkedIn" role="menuitem" aria-label="LinkedIn" data-tooltip="LinkedIn" tabIndex="0" onClick={this.handleLinkedinClick.bind(this)}>
                        <LinkedinShareButton
                            url={shareUrl}
                            title={'I have found a very interesting deck, here on SlideWiki. (' + shareUrl + ')'}
                            windowWidth={750}
                            windowHeight={600}
                            className="Demo__some-network__share-button">
                            <LinkedinIcon
                                size={32}
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
