/**
 * Created by lfernandes on 08.03.17.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import sendReportShowWrongFields from '../../actions/report/sendReportShowWrongFields';
import UserProfileStore from '../../stores/UserProfileStore';
import SendReportStore from '../../stores/SendReportStore';
let ReactDOM = require('react-dom');
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
        this.reasonSelected = true;
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

        e.preventDefault();
        if(!this.refs.reason.value){
            wrongFields.reason = true;
        }

        if( !this.refs.text.value ){
            wrongFields.text = true;
        } else {
            if(this.refs.text.value.trim() === ''){
                wrongFields.text = true;
            }
        }

        this.context.executeAction(sendReportShowWrongFields, wrongFields);
        /*
        if (this.refs.reason.value !== '' && this.refs.text.value !== '') {
            this.context.executeAction(addComment, {
                selector: this.props.ContentDiscussionStore.selector,
                title: this.refs.title.value,
                text: this.refs.text.value,
                userid: this.props.UserProfileStore.userid
            });

            this.refs.title.value = '';
            this.refs.text.value = '';
        }
        */
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
                        <h1 style={headerStyle}>Report legal or spam issue with deck/slide content</h1>
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
                                                <div className="item" data-value="spam">Spam</div>
                                                <div className="item" data-value="copyright">Copyright</div>
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

ReportModal = connectToStores(ReportModal, [UserProfileStore, SendReportStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        SendReportStore: context.getStore(SendReportStore).getState()
    };
});

export default ReportModal;
