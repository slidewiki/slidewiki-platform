import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown, Icon, Button } from 'semantic-ui-react';
import {ShareButtons, generateShareIcon} from 'react-share';

class SocialSharing extends React.Component {

/*
  Props:
    roomURL: full URL to share
    currentSlideURL: full URL to share
    hashTags: ['#a','#b',...]
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

    postTweet(e) {
        e.preventDefault();
        function FindLeftWindowBoundry(){
          	if (window.screenLeft)
          		return window.screenLeft;
          	if (window.screenX)
          		return window.screenX;
          	return 0;
        }

        function FindTopWindowBoundry(){
          	if (window.screenTop)
          		return window.screenTop;
          	if (window.screenY)
          		return window.screenY;
          	return 0;
        }
        let x = screen.width/2 - 700/2 + FindLeftWindowBoundry();
        let y = screen.height/2 - 450/2 + FindTopWindowBoundry();
        window.open('https://twitter.com/intent/tweet?button_hashtag=' + this.props.hashTags.join('%20%23').replace(/#/g, '') , 'test', 'width=500,height=260,left='+x+',top='+y);
        return false;
    }

    render() {

        const {
            FacebookShareButton,
            TwitterShareButton,
            GooglePlusShareButton,
            TelegramShareButton,
            // EmailShareButton
        } = ShareButtons;

        let shareMessage = 'Someone presented me a very interesting slide in a presentation room on SlideWiki!';
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



        return(
            <div>
            <Dropdown ref="shareDropDown" icon='share alternate' pointing="bottom left" upward={true} button compact className='icon' style={{'float': 'right'}} aria-label="Share" aria-haspopup="true" data-tooltip="Share" data-position="right center">
                <Dropdown.Menu role="menu">
                    <Dropdown.Item aria-label="URL" role="menuitem" aria-haspopup="true" data-tooltip="URL" data-position="right center" onClick={this.copyURLToClipboard.bind(this)}>
                        <Icon circular inverted name="linkify" size="large"/>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item aria-label="Facebook" role="menuitem" aria-haspopup="true" data-tooltip="Facebook" data-position="right center">
                        <FacebookShareButton url={this.props.currentSlideURL} quote={shareMessage}>
                            <Icon circular inverted name="facebook" size="large"/>
                        </FacebookShareButton>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item aria-label="Twitter" role="menuitem" aria-haspopup="true" data-tooltip="Twitter" data-position="right center">
                        <TwitterShareButton url={this.props.currentSlideURL} title={shareMessage}>
                            <Icon circular inverted name="twitter" size="large"/>
                        </TwitterShareButton>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item aria-label="Google Plus" role="menuitem" aria-haspopup="true" data-tooltip="GooglePus" data-position="right center">
                        <GooglePlusShareButton url={this.props.currentSlideURL} quote={shareMessage} className="Demo__some-network__share-button">
                          <Icon circular inverted name="google plus" size="large"/>
                        </GooglePlusShareButton>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item aria-label="Telegram" role="menuitem" aria-haspopup="true" data-tooltip="Telegram" data-position="right center">
                        <TelegramShareButton url={this.props.currentSlideURL} title={shareMessage}>
                          <Icon circular inverted name="send" size="large"/>
                        </TelegramShareButton>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Button content={this.props.hashTags.join(' ')} labelPosition='left' icon='twitter' primary onClick={this.postTweet.bind(this)} style={{position: 'fixed', padding: '5px', paddingLeft: '2.5rem !important', paddingRight: '0.8rem!important', display: 'block', whiteSpace: 'nowrap', textDecoration: 'none !important', borderRadius: '0 0 5px 5px', left: '100%', top: '0.4rem', transform: 'rotate(90deg)', transformOrigin: 'top left'}}/>
            </div>
        );
    }
}

SocialSharing.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default SocialSharing;
