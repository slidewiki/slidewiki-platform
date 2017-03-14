/**
 * Created by lfernandes on 08.03.17.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import sendReportShowWrongFields from '../../actions/report/sendReportShowWrongFields';
import ContentStore from '../../stores/ContentStore';
import UserProfileStore from '../../stores/UserProfileStore';
import SendReportStore from '../../stores/SendReportStore';
let classNames = require('classnames');

const headerStyle = {
    'textAlign': 'center'
};

const modalStyle = {
    top: '15%'
};

class ReportModal extends React.Component {
    constructor(props) {
        super(props);
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

            //let toEmail = 'luis.daniel.fernandes.rotger@iais.fraunhofer.de';

            let toEmail = 'sednanref2004@gmail.com';

            let link = "mailto:" + toEmail
                // + "?cc=myCCaddress@example.com"
                + "&subject=" + escape(subject)
                + "&body=" + escape(emailBody);
            window.location.href = link;

            $('.ui.report.modal')
                .modal('toggle');
        }

        return false;
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
            <div>
                <div className="ui report modal" id='reportModal' style={modalStyle}>
                    <div className="header">
                        <h1 style={headerStyle}>Report legal or spam issue with {this.props.ContentStore.selector.stype === 'slide' ? 'slide' : 'deck' } content</h1>
                    </div>
                    <div className="content">
                        <div className="ui container">
                            <div className="ui blue padded center aligned segment">
                                <form className="ui form report">
                                    <div className={fieldClass_reason} data-tooltip="Please select a reason" ref="reasonDropdown">
                                        <input type="hidden" id="reason" name="reason" ref="reason" />
                                            <i className="dropdown icon"/>
                                            <div className="default text">Reason</div>
                                            <div className="menu">
                                                <div className="item" data-value="copyright">Copyright</div>
                                                <div className="item" data-value="spam">Spam</div>
                                            </div>
                                    </div>
                                    <br/>
                                    <br/>
                                    <div className={fieldClass_text}>
                                        <label>Explanation</label>
                                        <textarea ref="text" id="reportComment" name="text" style={{width:'50%', minHeight: '6em', height: '6em'}} placeholder="Please give a short explanation about your report"></textarea>
                                    </div>
                                    <br/>
                                    <div className="ui center aligned">
                                        <button type="submit" className="ui blue labeled submit icon button" ><i className="icon warning circle"/>Send</button>
                                    </div>
                                    <br/>

                                    <div className="ui error message"/>
                                </form>
                                <br/>
                            </div>
                        </div>
                    </div>
                    <div className="actions">
                        <button type="cancel" className="ui cancel button">
                            <i className="remove icon"/>Close
                        </button>
                    </div>
                </div>
            </div>
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
