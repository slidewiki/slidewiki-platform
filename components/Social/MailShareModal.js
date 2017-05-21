import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import mailShareShowWrongFields from '../../actions/socialshare/mailShareShowWrongFields';
import FocusTrap from 'focus-trap-react';
import SocialShareStore from '../../stores/SocialShareStore';
import { Button, Container, Form, Modal, TextArea, Icon, Segment } from 'semantic-ui-react';
let classNames = require('classnames');
import {publicRecaptchaKey} from '../../configs/general';
import ReCAPTCHA from 'react-google-recaptcha';

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
        $(this.refs.reasonDropdown).dropdown();
        const reportValidation = {
            fields: {
                reason: {
                    identifier: 'reason'
                },
                text: {
                    identifier: 'text'
                }
            },
            onSuccess: this.handleSendMail.bind(this)
        };

        $('.ui.form.report')
            .form(reportValidation);
    }

    componentDidUpdate() {
        $(this.refs.reasonDropdown).dropdown();
    }

    getSelected() {
        return this.refs.reason.value;
    }

    handleSendReport(e) {
        let wrongFields = {
            reason: false,
            text: false,
            name: false
        };

        let everythingOk = true;
        e.preventDefault();
        if(!this.refs.reason.value){
            wrongFields.reason = true;
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

        if((!this.refs.name || !this.refs.name.value || (this.refs.text.value.trim() === '')) && (this.props.userid === '')) {
            wrongFields.name = true;
            everythingOk = false;
        }

        // Recaptcha Validation
        if(  this.props.userid === '' &&
            (this.state === null || this.state.grecaptcharesponse === undefined)) {
            everythingOk= false;
        }

        this.context.executeAction(mailShareShowWrongFields, wrongFields);
        if(everythingOk) {

            let deckOrSlideMailShareLine = '';
            if(this.props.selector.stype === 'slide') {
                deckOrSlideMailShareLine = 'Shares Slide: ' + this.props.selector.sid + '\n'
                    + 'From Deck: ' + this.props.selector.id + '\n';
            } else {
                deckOrSlideMailShareLine = 'Shares Deck: ' + this.props.selector.id + '\n';
            }

            let userId = '';
            // If user is not logged in, use the name provided
            if(this.props.userid === '') {
                userId = this.refs.name.value;
            } else {
                userId = this.props.userid;
            }
            let subject = '[SlideWiki] Sharing Deck/Slide' ;
            let emailBody = 'User: ' + userId + '\n'
                + deckOrSlideMailShareLine
                + 'Reason of sharing: ' + this.refs.reason.value + '\n'
                + 'Description of sharing: \n\n' + this.refs.text.value + '\n\n\n';

            let toEmail = '';

            let link = 'mailto:' + escape(toEmail)
                // + "?cc=myCCaddress@example.com"
                + '?subject=' + escape(subject)
                + '&body=' + escape(emailBody);
            window.location.href = link;
            this.handleClose();
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
        let fieldClass_reason = classNames({
            'ui': true,
            'selection': true,
            'dropdown': true,
            'required': true,
            'error': this.props.SocialShareStore.wrongFields.reason
        });

        let fieldClass_text = classNames({
            'ui': true,
            'center': true,
            'aligned': true,
            'field': true,
            'error': this.props.SocialShareStore.wrongFields.text
        });

        let fieldClass_name = classNames({
            'ui': true,
            'center': true,
            'aligned': true,
            'field': true,
            'error': this.props.SocialShareStore.wrongFields.name
        });

        const recaptchaStyle = {display: 'inline-block'};

        let nameField =
            <div className={fieldClass_name} style={{width:'auto'}} >
                <div className="ui icon input" style={{width:'50%'}} ><input type="text" id="name_label" name="name" ref="name" placeholder="name" autoFocus aria-required="true"/></div>
            </div>;
        let captchaField =
            <div >
                <input type="hidden" id="recaptcha" name="recaptcha"></input>
                <ReCAPTCHA style={recaptchaStyle} ref="recaptcha" sitekey={publicRecaptchaKey} onChange={this.onRecaptchaChange.bind(this)} aria-required="true"/>
            </div>;

        return (

            <Modal
                trigger={
                    <Button icon aria-hidden="false" data-value="Mail" role="menuitem" className="ui basic button" type="button" aria-label="Mail" data-tooltip="E-mail" tabIndex="0" onClick={this.handleOpen} >
                          <Icon name="mail blue inverted circular icon" size='large' />
                    </Button>
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
                    initialFocus="#reason"
                    >
                    <Modal.Header className="ui center aligned" id="mailShareModalHeader">
                        <h1 style={headerStyle}>Share {this.props.ContentStore.selector.stype === 'slide' ? 'slide' : 'deck' } </h1>
                    </Modal.Header>
                    <Modal.Content>
                        <Container>
                            <Segment color="blue" textAlign="center" padded>
                               <Segment>
                                   <div className="sr-only" id="mailShareModalDescription">Select the reason for sharing and give a brief description about it.</div>
                                <Form id="mailShareForm">
                                    {(this.props.userid === '') ?  nameField: ''}
                                    <div style={{width:'50%'}} className={fieldClass_reason} data-tooltip="Please select a reason" ref="reasonDropdown">
                                        <input type="hidden" id="reason" name="reason" ref="reason" />
                                            <i className="dropdown icon"/>
                                            <div className="default text">Reason</div>
                                            <div className="menu">
                                                <div className="item" data-value="copyright">Copyright</div>
                                                <div className="item" data-value="spam">Spam</div>
                                            </div>
                                    </div>
                                    <br/>
                                    <div className={fieldClass_text}>
                                        <label>Explanation</label>
                                        <textarea ref="text" id="mailShareComment" name="text" style={{width:'50%', minHeight: '6em', height: '6em'}} placeholder="Please give a short explanation about sharing"></textarea>
                                    </div>
                                    {(this.props.userid === '') ?  captchaField: ''}
                                    <Button
                                        color="blue"
                                        type="submit"
                                        content="Send"
                                        icon='mail circle'
                                        onClick={this.handleSendMail}
                                    />
                                    <Button
                                        icon="remove"
                                        color="red"
                                        type="button"
                                        onClick={this.handleClose}
                                        content="Cancel"
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
