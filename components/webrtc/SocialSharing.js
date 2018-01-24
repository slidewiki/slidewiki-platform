import React from 'react';
import { Dropdown, Icon, Button } from 'semantic-ui-react';
import {ShareButtons, generateShareIcon} from 'react-share';

class SocialSharing extends React.Component {

/*
  Props:
    roomURL: full URL to share
    currentSlideURL: full URL to share
*/
    copyURLToClipboard() {
        let toCopy = document.createElement('input');
        toCopy.style.position = 'fixed';
        toCopy.style.top = 0;
        toCopy.style.left = 0;
        toCopy.style.width = '2em';
        toCopy.style.height = '2em';
        toCopy.style.padding = 0;
        toCopy.style.border = 'none';
        toCopy.style.outline = 'none';
        toCopy.style.boxShadow = 'none';
        toCopy.style.background = 'transparent';
        toCopy.value = window.location.href;
        document.body.appendChild(toCopy);
        toCopy.value = window.location.href;
        toCopy.select();

        try {
            let successful = document.execCommand('copy');
            if(!successful)
                throw 'Unable to copy';
            else{
                swal({
                    titleText: 'URL copied to clipboard',
                    type: 'success',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    timer: 1500
                }).then(() => {}, () => {});
            }
        } catch (err) {
            console.log('Oops, unable to copy');
            swal({
                titleText: 'Can\'t copy URL to clipboard',
                text: 'Please select the URL in your browser and share it manually.',
                type: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Check',
                allowOutsideClick: false
            });
        }
        document.body.removeChild(toCopy);
    }

    render() {

        const {
            // FacebookShareButton,
            TwitterShareButton,
            GooglePlusShareButton,
            TelegramShareButton,
            // EmailShareButton
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
        //     <FacebookShareButton url={this.props.currentSlideURL} quote={shareMessage}>
        //         <Icon circular inverted name="facebook" size="large"/>
        //     </FacebookShareButton>
        // </Dropdown.Item>
        // <Dropdown.Divider />

        return(
            <Dropdown ref="shareDropDown" icon='share alternate' pointing="bottom" upward={true} button compact className='icon' style={{'float': 'right'}}>
                <Dropdown.Menu>
                    <Dropdown.Item aria-label="URL" onClick={this.copyURLToClipboard.bind(this)}>
                        <Icon circular inverted name="external" size="large"/>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item aria-label="Twitter">
                        <TwitterShareButton url={this.props.currentSlideURL} title={shareMessage}>
                            <Icon circular inverted name="twitter" size="large"/>
                        </TwitterShareButton>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item aria-label="Telegram">
                        <TelegramShareButton url={this.props.currentSlideURL} title={shareMessage}>
                          <Icon circular inverted name="send" size="large"/>
                        </TelegramShareButton>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item aria-label="Google Plus">
                        <GooglePlusShareButton url={this.props.currentSlideURL} quote={shareMessage} className="Demo__some-network__share-button">
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
