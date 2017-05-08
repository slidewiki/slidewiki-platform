/**
 * Created by lfernandes on 08.03.17.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import sendReportShowWrongFields from '../../actions/report/sendReportShowWrongFields';
import closeReportModal from '../../actions/report/closeReportModal';
import ContentStore from '../../stores/ContentStore';
import FocusTrap from 'focus-trap-react';
import UserProfileStore from '../../stores/UserProfileStore';
import SendReportStore from '../../stores/SendReportStore';
import { Button, Container, Form, Modal, TextArea, Icon, Segment } from 'semantic-ui-react';
let classNames = require('classnames');

const headerStyle = {
    'textAlign': 'center'
};

class ReportModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeTrap: false
        };
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
            text: false
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

        this.context.executeAction(sendReportShowWrongFields, wrongFields);
        if(everythingOk) {

            let deckOrSlideReportLine = '';
            if(this.props.ContentStore.selector.stype === 'slide') {
                deckOrSlideReportLine = 'Report on Slide: ' + this.props.ContentStore.selector.sid + '\n'
                    + 'From Deck: ' + this.props.ContentStore.selector.id + '\n';
            } else {
                deckOrSlideReportLine = 'Report on Deck: ' + this.props.ContentStore.selector.id + '\n';
            }

            let subject = '[SlideWiki] Report on Deck/Slide' ;
            let emailBody = 'Report made by user: ' + this.props.UserProfileStore.userid + '\n'
                + deckOrSlideReportLine
                + 'Reason of the report: ' + this.refs.reason.value + '\n'
                + 'Description of the report: \n\n' + this.refs.text.value + '\n\n\n';

            let toEmail = 'ka.de.graaf@vu.nl';

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

    render() {
        let fieldClass_reason = classNames({
            'ui': true,
            'selection': true,
            'dropdown': true,
            'required': true,
            'error': this.props.SendReportStore.wrongFields.reason
        });

        let fieldClass_text = classNames({
            'ui': true,
            'center': true,
            'aligned': true,
            'field': true,
            'error': this.props.SendReportStore.wrongFields.text
        });

        return(

                <Modal
                    trigger={
                          <Button icon aria-hidden="false" className="ui button" type="button" aria-label="Report" data-tooltip="Report" onClick={this.handleOpen} >
                                <Icon name="warning circle" size='large' />
                          </Button>

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
                        onDeactivate={this.unmountTrap}
                        clickOutsideDeactivates={true}
                        initialFocus="#reason"
                        >
                        <Modal.Header className="ui center aligned" id="reportModalHeader">
                            <h1 style={headerStyle}>Report legal or spam issue with {this.props.ContentStore.selector.stype === 'slide' ? 'slide' : 'deck' } content</h1>
                        </Modal.Header>
                        <Modal.Content>
                            <Container>
                                <Segment color="blue" textAlign="center" padded>
                                   <Segment>
                                       <div className="sr-only" id="reportModalDescription">Select the reason of the report and give a brief description about it.</div>
                                    <Form id="reportForm">
                                        <div className="ui inline required field">
                                            <div className="ui icon input"><input style={{width:'50%'}} type="text" id="name_label" name="name" ref="name" placeholder="name" autoFocus aria-required="true"/></div>
                                        </div>
                                        <div className={fieldClass_reason} data-tooltip="Please select a reason" ref="reasonDropdown">
                                            <input style={{width:'50%'}} type="hidden" id="reason" name="reason" ref="reason" />
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
                                            <textarea ref="text" id="reportComment" name="text" style={{width:'50%', minHeight: '6em', height: '6em'}} placeholder="Please give a short explanation about your report"></textarea>
                                        </div>
                                        <Button
                                            color="blue"
                                            type="submit"
                                            content="Send"
                                            icon='warning circle'
                                            onClick={this.handleSendReport}
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

ReportModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

ReportModal = connectToStores(ReportModal, [ContentStore, UserProfileStore, SendReportStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        SendReportStore: context.getStore(SendReportStore).getState(),
        ContentStore: context.getStore(ContentStore).getState()
    };
});

export default ReportModal;
