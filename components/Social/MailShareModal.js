import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import mailShareShowWrongFields from '../../actions/socialshare/mailShareShowWrongFields';
import addActivity from '../../actions/activityfeed/addActivity';
import incrementDeckViewCounter from '../../actions/activityfeed/incrementDeckViewCounter';
import FocusTrap from 'focus-trap-react';
import SocialShareStore from '../../stores/SocialShareStore';
import { Button, Container, Form, Modal, Icon, Segment } from 'semantic-ui-react';
import {publicRecaptchaKey} from '../../configs/general';
import ReCAPTCHA from 'react-google-recaptcha';
let classNames = require('classnames');

const headerStyle = {
    'textAlign': 'center'
};

class MailShareModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeTrap: false,
            'grecaptcharesponse': undefined
        };
        this.handleSendMail= this.handleSendMail.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
    }

    componentDidMount() {
        const formValidation = {
            fields: {
                address: {
                    identifier: 'address'
                },
                subject: {
                    identifier: 'subject'
                },
                text: {
                    identifier: 'text'
                }
            },
            onSuccess: this.handleSendMail.bind(this)
        };

        if($('.ui.form.mail').length === 1){$('.ui.form.mail').form(formValidation);}
    }

    handleSendMail(e) {
        let wrongFields = {
            address: false,
            subject: false,
            text: false
        };

        let everythingOk = true;
        e.preventDefault();
        if(!this.refs.subject.value){
            wrongFields.subject = true;
            everythingOk = false;
        }

        if( !this.refs.text.value ){
            wrongFields.text = true;
            everythingOk = false;
        } else {
            if(this.refs.text.value.trim() === ''){
                wrongFields.text = true;
                everythingOk = false;
            }
        }

        const address = this.refs.address.value;
        if(!address || (address.indexOf('@') === -1) || (address.indexOf('.') === -1) || (address.length < 5)) {
            wrongFields.address = true;
            everythingOk = false;
        }

        // Recaptcha Validation
        if( this.props.userid === '' &&
            (this.state === null || this.state.grecaptcharesponse === undefined)) {
            everythingOk= false;
        }

        this.context.executeAction(mailShareShowWrongFields, wrongFields);
        if(everythingOk) {

            let subject = this.refs.subject.value ;
            let emailBody = this.refs.text.value;
            let toEmail = this.refs.address.value;

            let link = 'mailto:' + escape(toEmail) +
                '?subject=' + escape(subject) +
                '&body=' + escape(emailBody);
            window.location.href = link;
            this.handleClose();

            //Add share activity
            let userId = String(this.props.userid);
            if (userId === '') {
                userId = '0';//Unknown - not logged in
            }
            let activity = {
                activity_type: 'share',
                user_id: userId,
                content_id: this.props.selector.sid,
                content_kind: this.props.selector.stype,
                share_info: {
                    platform: 'E-mail'
                }
            };
            context.executeAction(addActivity, {activity: activity});
            context.executeAction(incrementDeckViewCounter, {type: 'share'});
        }
    }

    handleOpen(){
        $('#app').attr('aria-hidden', 'true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });
    }

    handleClose(){
        $('#app').attr('aria-hidden', 'false');
        this.setState({
            modalOpen: false,
            activeTrap: false
        });
    }

    unmountTrap() {
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    onRecaptchaChange(response) {
        this.setState({
            'grecaptcharesponse': response
        });
    }

    render() {
        let fieldClass_subject = classNames({
            'ui': true,
            'aligned': true,
            'field': true,
            'error': this.props.SocialShareStore.wrongFields.subject
        });

        let fieldClass_text = classNames({
            'ui': true,
            'aligned': true,
            'field': true,
            'error': this.props.SocialShareStore.wrongFields.text
        });

        let fieldClass_address = classNames({
            'ui': true,
            'aligned': true,
            'field': true,
            'error': this.props.SocialShareStore.wrongFields.address
        });

        const recaptchaStyle = {display: 'inline-block'};
        let shareUrl = '';
        if (typeof window !== 'undefined') {
            shareUrl = window.location.href;
        }

        const shareMessage = 'Hi.\nI have found a very interesting ' + this.props.selector.stype + ', here on SlideWiki.\n' + shareUrl;
        const shareSubject = 'Interesting ' + this.props.selector.stype + ' on SlideWiki';
        let captchaField =
            <div >
                <input type="hidden" id="recaptcha" name="recaptcha"></input>
                <ReCAPTCHA style={recaptchaStyle} ref="recaptcha" sitekey={publicRecaptchaKey} onChange={this.onRecaptchaChange.bind(this)} aria-required="true"/>
            </div>;
        return (
            <Modal
                trigger={
                    <div style={{'textAlign': 'center', 'marginTop': '2px', 'marginBottom': '2px'}} data-value="E-mail" role="menuitem" aria-label="E-mail" data-tooltip="E-mail" >
                          <Icon name="mail" color="orange" inverted={true} link={true} circular={true} aria-hidden="false" className="button" onClick={this.handleOpen} />
                    </div>
                }
                open={this.state.modalOpen}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                id="mailShareModal"
                aria-labelledby="mailShareModalHeader"
                aria-describedby="mailShareModalDescription"
                tabIndex="0"
            >

                <FocusTrap
                    id="focus-trap-mailShareModal"
                    className = "header"
                    active={this.state.activeTrap}
                    onDeactivate={this.unmountTrap}
                    clickOutsideDeactivates={true}
                    initialFocus="#address"
                    >
                    <Modal.Header className="ui center aligned" id="mailShareModalHeader">
                        <h1 style={headerStyle}>Share this {this.props.selector.stype === 'slide' ? 'slide' : 'deck' } </h1>
                    </Modal.Header>
                    <Modal.Content>
                        <Container>
                            <Segment color="blue" textAlign="center" padded>
                               <Segment>
                                   <div className="sr-only" id="mailShareModalDescription">Select email recepient, subject and content.</div>
                                <Form id="mailShareForm">
                                    <div className={fieldClass_address} style={{width:'auto'}} >
                                        <label htmlFor="address_label">To</label>
                                        <div className="ui icon input" style={{width:'50%'}} ><input type="text" id="address_label" name="address" ref="address" placeholder="E-mail address" autoFocus aria-required="true"/></div>
                                    </div>

                                    <div className={fieldClass_subject} style={{width:'auto'}} >
                                        <label htmlFor="subject_label">Subject</label>
                                        <div className="ui icon input" style={{width:'50%'}} ><input type="text" id="subject_label" name="subject" ref="subject" aria-required="true" defaultValue={shareSubject} /></div>
                                    </div>
                                    <div className={fieldClass_text}>
                                        <label htmlFor="mailShareComment">Text</label>
                                        <textarea ref="text" id="mailShareComment" name="text" defaultValue={shareMessage} style={{width:'50%', minHeight: '6em', height: '6em'}} ></textarea>
                                    </div>
                                    {(this.props.userid === '') ? captchaField: ''}
                                    <Button
                                        icon='mail'
                                        color="blue"
                                        type="submit"
                                        content="Send"
                                        onClick={this.handleSendMail}
                                    />
                                    <Button
                                        icon="remove"
                                        color="red"
                                        type="button"
                                        content="Cancel"
                                        onClick={this.handleClose}
                                    />
                                    <div className="ui error message"/>
                                </Form>
                                </Segment>
                            </Segment>
                        </Container>
                    </Modal.Content>
                </FocusTrap>
            </Modal>
        );
    }
}

MailShareModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

MailShareModal = connectToStores(MailShareModal, [SocialShareStore], (context, props) => {
    return {
        SocialShareStore: context.getStore(SocialShareStore).getState()
    };
});

export default MailShareModal;
