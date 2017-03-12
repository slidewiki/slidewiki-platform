/**
 * Created by lfernandes on 08.03.17.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../stores/UserProfileStore';

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
            onSuccess: this.handleAddComment.bind(this)
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

    handleAddComment(e) {
        // e.preventDefault();
        //console.log('//////////////////////////');
        //console.log(this.refs.reason.value);
        //console.log(this.refs.text.value);
        //console.log('//////////////////////////');
        /*
        if (this.refs.title.value !== '' && this.refs.text.value !== '') {
            this.context.executeAction(addComment, {
                selector: this.props.ContentDiscussionStore.selector,
                title: this.refs.title.value,
                text: this.refs.text.value,
                userid: this.props.UserProfileStore.userid
            });

            this.refs.title.value = '';
            this.refs.text.value = '';
        }
        return false;
        */
    }

    render() {
        return(
            <div>
                <div className="ui report modal" id='reportModal' style={modalStyle}>
                    <div className="header">
                        <h1 style={headerStyle}>Report legal or spam issue with deck/slide content</h1>
                    </div>
                    <div className="content">
                        <div className="ui container">
                            <div className="ui blue padded center aligned segment">
                                <form className="ui form signin">
                                    <div className="ui selection dropdown required" data-tooltip="Please select a reason" ref="reasonDropdown">
                                        <input type="hidden" id="reason" name="reason" ref="reason" required/>
                                            <i className="dropdown icon"/>
                                            <div className="default text">Reason</div>
                                            <div className="menu">
                                                <div className="item" data-value="spam">Spam</div>
                                                <div className="item" data-value="copyright">Copyright</div>
                                            </div>
                                    </div>
                                    <br/>
                                    <br/>
                                    <div className="ui center aligned required field">
                                        <label>Explanation</label>
                                        <textarea ref="text" id="reportComment" name="text" style={{width:'50%', minHeight: '6em', height: '6em'}} placeholder="Please give a short explanation about your report" required ></textarea>
                                    </div>
                                    <br/>
                                    <div className="ui center aligned">
                                        <button type="submit" className="ui blue labeled submit icon button" ><i className="icon warning circle" onClick={this.handleAddComment()}/>Send</button>
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

ReportModal = connectToStores(ReportModal, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default ReportModal;
