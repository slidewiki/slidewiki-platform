/**
 * Created by lfernandes on 08.03.17.
 */

import React from 'react';
import {hashPassword} from '../../configs/general';
import {Microservices} from '../../configs/microservices';

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
    }

    componentDidUpdate() {
        $(this.refs.reasonDropdown).dropdown();
    }

    getSelected() {
        return this.refs.reason.value;
    }

    render() {

        return(
            <div>
                <div className="ui report modal" id='reportModal' style={modalStyle}>
                    <div className="header">
                        <h1 style={headerStyle}>Report Deck</h1>
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

export default ReportModal;
