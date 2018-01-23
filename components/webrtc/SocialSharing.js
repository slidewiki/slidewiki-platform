import React from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';
import {ShareButtons, generateShareIcon} from 'react-share';

class SocialSharing extends React.Component {

/*
  Props:
    roomURL: full URL to share
    currentSlideURL: full URL to share
*/

    render() {

        const {
            //FacebookShareButton,
            TwitterShareButton,
            GooglePlusShareButton,
            TelegramShareButton,
            //EmailShareButton
        } = ShareButtons;

        let shareMessage = 'Someone presentend me a very interesting slide in a presentation room on SlideWiki. See ' + this.props.currentSlideURL;
        //const emailShareMessage = 'Hi.\nSomeone presentend me a very <a href="'+this.props.currentSlideURL+'">interesting slide</a> in a <a href="'+this.props.roomURL+'">presentation room</a> on SlideWiki.\n';
        //const emailShareSubject = 'Interesting slide on SlideWiki';
        // <Dropdown.Item aria-label="E-mail"> //triggers the close event handler of a data channel
        //     <EmailShareButton
        //         url={this.props.currentSlideURL}
        //         subject={emailShareSubject}
        //         body={emailShareMessage}
        //         className="Demo__some-network__share-button">
        //         <Icon circular inverted name="mail" size="large"/>
        //     </EmailShareButton>
        // </Dropdown.Item>
        // <Dropdown.Item aria-label="Facebook">
        //     <FacebookShareButton
        //         url={this.props.currentSlideURL}
        //         quote={shareMessage}
        //         className="Demo__some-network__share-button">
        //         <Icon circular inverted name="facebook" size="large"/>
        //     </FacebookShareButton>
        // </Dropdown.Item>
        return(
            <Dropdown ref="shareDropDown" icon='share alternate' pointing="bottom" upward={true} button compact className='icon' style={{'float': 'right'}}>
                <Dropdown.Menu>
                    <Dropdown.Item aria-label="Twitter">
                        <TwitterShareButton
                            url={this.props.currentSlideURL}
                            title={shareMessage}
                            className="Demo__some-network__share-button">
                            <Icon circular inverted name="twitter" size="large"/>
                        </TwitterShareButton>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item aria-label="Telegram">
                        <TelegramShareButton
                            url={this.props.currentSlideURL}
                            title={shareMessage}
                            className="Demo__some-network__share-button">
                            <Icon circular inverted name="telegram" size="large"/>
                        </TelegramShareButton>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item aria-label="Google Plus">
                        <GooglePlusShareButton
                            url={this.props.currentSlideURL}
                            quote={shareMessage}
                            className="Demo__some-network__share-button">
                            <Icon circular inverted name="google plus" size="large"/>
                        </GooglePlusShareButton>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

SocialSharing.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SocialSharing;
