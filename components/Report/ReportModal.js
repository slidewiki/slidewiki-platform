import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import sendReportShowWrongFields from '../../actions/report/sendReportShowWrongFields';
import closeReportModal from '../../actions/report/closeReportModal';
import ContentStore from '../../stores/ContentStore';
import FocusTrap from 'focus-trap-react';
import UserProfileStore from '../../stores/UserProfileStore';
import SendReportStore from '../../stores/SendReportStore';
import { Button, Container, Form, Modal, TextArea, Icon, Segment } from 'semantic-ui-react';
import  classNames from 'classnames';
import {publicRecaptchaKey} from '../../configs/general';
import ReCAPTCHA from 'react-google-recaptcha';
import sendReport from '../../actions/report/sendReport';
import {FormattedMessage, defineMessages} from 'react-intl';

const headerStyle = {
    'textAlign': 'center'
};

class ReportModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeTrap: false,
            'grecaptcharesponse': undefined
        };
        this.messages = defineMessages({
            input_name:{
                id: 'reportModal.input_name',
                defaultMessage:'Name'
            },
            modal_title:{
                id:'reportModal.modal_title',
                defaultMessage: 'Report legal or spam issue with'
            },
            modal_title_2:{
                id:'reportModal.modal_title_2',
                defaultMessage: 'content'
            },
            modal_description:{
                id: 'reportModal.modal_description',
                defaultMessage: 'Select the reason of the report and give a brief description about it.'

            },
            reason_tooltip:{
                id: 'reportModal.reason_tooltip',
                defaultMessage: 'Please select a reason'

            },
            reason_option_reason:{
                id: 'reportModal.reason_option_reason',
                defaultMessage:'Reason'
            },
            reason_option_spam:{
                id: 'reportModal.reason_option_spam',
                defaultMessage:'Spam'
            },
            reason_option_copy:{
                id: 'reportModal.reason_option_copy',
                defaultMessage:'Copyright'
            },
            explanation:{
                id: 'reportModal.explanation',
                defaultMessage:'Explanation'
            },
            explanation_placeholder:{
                id: 'reportModal.explanation_placeholder',
                defaultMessage:'Please give a short explanation about your report'
            },
            send_button:{
                id:'reportModal.send_button',
                defaultMessage:'Send'
            },
            cancel_button:{
                id:'reportModal.cancel_button',
                defaultMessage:'Cancel'
            },
            swal_title:{
                id: 'reportModal.swal_title',
                defaultMessage:'Deck Report'
            },
            send_swal_text:{
                id: 'reportModal.send_swal_text',
                defaultMessage:'Report sent. Thank you!'
            },
            send_swal_button:{
                id: 'reportModal.send_swal_button',
                defaultMessage:'Close'
            },
            send_swal_error_text: {
                id: 'reportModal.send_swal_error_text',
                defaultMessage:'An error occured while sending the report. Please try again later.'
            },
            send_swal_error_button:{
                id: 'reportModal.send_swal_error_button',
                defaultMessage:'Close'
            }
        });


        this.handleSendReport= this.handleSendReport.bind(this);
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
            onSuccess: this.handleSendReport.bind(this)
        };

        //$('.ui.form.report').form(reportValidation);
    }

    componentDidUpdate() {
        $(this.refs.reasonDropdown).dropdown();
    }

    getSelected() {
        return this.refs.reason.value;
    }
    getSwalMessages(){
      //Get the messages which will show in the swal showed  when the report is sent
        return {
            title: this.context.intl.formatMessage(this.messages.swal_title),
            text: this.context.intl.formatMessage(this.messages.send_swal_text),
            confirmButtonText: this.context.intl.formatMessage(this.messages.send_swal_button),
            error_text: this.context.intl.formatMessage(this.messages.send_swal_error_text),
            error_confirmButtonText: this.context.intl.formatMessage(this.messages.send_swal_error_button)
        };
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


        if((!this.refs.name || !this.refs.name.value || (this.refs.text.value.trim() === '')) && (this.props.UserProfileStore.userid === '')) {
            wrongFields.name = true;
            everythingOk = false;
        }

        // Recaptcha Validation
        if(  this.props.UserProfileStore.userid === '' &&
            (this.state === null || this.state.grecaptcharesponse === undefined)) {
            everythingOk= false;
        }

        this.context.executeAction(sendReportShowWrongFields, wrongFields);
        if(everythingOk) {

            let deckOrSlideReportLine = '';
            if(this.props.ContentStore.selector.stype === 'slide') {
                deckOrSlideReportLine = 'Report on Slide: ' + this.props.ContentStore.selector.sid + '\n'
                    + 'From Deck: ' + this.props.ContentStore.selector.id + '\n';
            } else {
                deckOrSlideReportLine = 'Report on Deck: ' + this.props.ContentStore.selector.id + '\n';
            }

            let userId = '';
            // If user is not logged in, use the name provided
            if(this.props.UserProfileStore.userid === '') {
                userId = this.refs.name.value;
            } else {
                userId = this.props.UserProfileStore.userid;
            }


            let payload = {
                subject :'[SlideWiki] Report on Deck/Slide' ,
                text :'Report made by user: ' + userId + '\n'
                    + deckOrSlideReportLine
                    + 'Reason of the report: ' + this.refs.reason.value + '\n'
                    + 'Description of the report: \n\n' + this.refs.text.value + '\n\n\n',
                swal_messages : this.getSwalMessages()
            };
            this.context.executeAction(sendReport,payload);


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
        this.context.executeAction(closeReportModal,{});

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
            'bottom': true,
            'error': this.props.SendReportStore.wrongFields.reason
        });

        let fieldClass_text = classNames({
            'ui': true,
            'center': true,
            'aligned': true,
            'field': true,
            'error': this.props.SendReportStore.wrongFields.text
        });

        let fieldClass_name = classNames({
            'ui': true,
            'center': true,
            'aligned': true,
            'field': true,
            'error': this.props.SendReportStore.wrongFields.name
        });

        const recaptchaStyle = {display: 'inline-block'};

        let nameField =
            <div className={fieldClass_name} style={{width:'auto'}} >
                <div className="ui icon input" style={{width:'50%'}} ><input type="text" id="name_label" name="name" ref="name" placeholder={ this.context.intl.formatMessage(this.messages.input_name)} autoFocus aria-required="true"/></div>
            </div>;
        let captchaField =
            <div >
                <input type="hidden" id="recaptcha" name="recaptcha"></input>
                <ReCAPTCHA style={recaptchaStyle} ref="recaptcha" sitekey={publicRecaptchaKey} onChange={this.onRecaptchaChange.bind(this)} aria-required="true"/>
            </div>;

        return(

                <Modal
                    trigger={ !this.props.textOnly ?
                          <Button icon aria-hidden="false" className="ui button" type="button" aria-label="Report" data-tooltip="Report" onClick={this.handleOpen} >
                                <Icon name="warning circle" size='large' />
                          </Button>
                          :
                          <div aria-label="Report" data-tooltip="Report" onClick={this.handleOpen} >
                                <Icon name="warning circle" size='large' /> Report
                          </div>
                        }
                    open={this.state.modalOpen}
                    onOpen={this.handleOpen}
                    onClose={this.handleClose}
                    id="reportModal"
                    aria-labelledby="reportModalHeader"
                    aria-describedby="reportModalDescription"
                    tabIndex="0"
                >
                    <FocusTrap
                        id="focus-trap-reportModal"
                        className = "header"
                        active={this.state.activeTrap}
                        focusTrapOptions={{
                            onDeactivate:this.unmountTrap,
                            clickOutsideDeactivates:true,
                            initialFocus: '#reportModalDescription'
                        }}
                        >
                        <Modal.Header className="ui center aligned" id="reportModalHeader">
                            <h1 style={headerStyle}>{this.context.intl.formatMessage(this.messages.modal_title)}  {this.props.ContentStore.selector.stype === 'slide' ? 'slide' : 'deck'} {this.context.intl.formatMessage(this.messages.modal_title_2)}</h1>
                        </Modal.Header>
                        <Modal.Content>
                            <Container>
                                <Segment color="blue" textAlign="left" padded>
                                  <div id="reportModalDescription" tabIndex="0">{this.context.intl.formatMessage(this.messages.modal_description)}</div>

                                   <Segment textAlign="center" >
                                    <Form id="reportForm">
                                        <Segment textAlign="left" >
                                        {(this.props.UserProfileStore.userid === '') ?  nameField: ''}
                                        <label htmlFor="reason">{this.context.intl.formatMessage(this.messages.reason_option_reason)}</label>
                                        <div style={{width:'50%'}} className={fieldClass_reason} style={{display:'block'}} data-tooltip={this.context.intl.formatMessage(this.messages.reason_tooltip)} ref="reasonDropdown">

                                            <input type="hidden" id="reason" name="reason" ref="reason"/>
                                                <i className="dropdown icon"/>
                                                <div className="default text">{this.context.intl.formatMessage(this.messages.reason_option_reason)}</div>
                                                <div className="menu" role="menu">
                                                    <div className="item" data-value="copyright" role="menuitem">{this.context.intl.formatMessage(this.messages.reason_option_copy)}</div>
                                                    <div className="item" data-value="spam" role="menuitem">{this.context.intl.formatMessage(this.messages.reason_option_spam)}</div>
                                                </div>
                                        </div>
                                        <br/>
                                        <div className={fieldClass_text}>
                                            <label htmlFor="reportComment">{this.context.intl.formatMessage(this.messages.explanation)}</label>
                                            <textarea ref="text" id="reportComment" name="text" style={{width:'100%', minHeight: '6em', height: '6em'}} placeholder={this.context.intl.formatMessage(this.messages.explanation_placeholder)}></textarea>
                                        </div>
                                        {(this.props.UserProfileStore.userid === '') ?  captchaField: ''}
                                        </Segment>
                                        <Button
                                            color="blue"
                                            type="submit"
                                            content={this.context.intl.formatMessage(this.messages.send_button)}
                                            icon='warning circle'
                                            onClick={this.handleSendReport}
                                        />
                                        <Button
                                            icon="remove"
                                            color="red"
                                            type="button"
                                            onClick={this.handleClose}
                                            content={this.context.intl.formatMessage(this.messages.cancel_button)}
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

ReportModal.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

ReportModal = connectToStores(ReportModal, [ContentStore, UserProfileStore, SendReportStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        SendReportStore: context.getStore(SendReportStore).getState(),
        ContentStore: context.getStore(ContentStore).getState()
    };
});

export default ReportModal;
