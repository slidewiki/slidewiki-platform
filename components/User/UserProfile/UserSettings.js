import React from 'react';
import ReactDom from 'react-dom';
import { Microservices } from '../../../configs/microservices';

class UserSettings extends React.Component {
    componentDidMount() {
        this.enableAccordion();
    }

    componentDidUpdate() {
        this.refreshAccordion();
    }
    enableAccordion(status) {
        $(this.refs.accordion).accordion();
    }
    refreshAccordion(status) {
        $(this.refs.accordion).accordion('refresh');
    }

    render() {
        return (
          <div>
            <div className="ui styled fluid accordion" ref="accordion">
            
              <div className="active title">
                <i className="dropdown icon"></i> <i className="user icon"></i>
                Personal Data
              </div>
              <div className="active content ui form">
                <div className="two fields">
                  <div className="ui labeled input field">
                    <div className="ui label">Firstname</div>
                    <input type="text" placeholder="Roy"></input>
                  </div>
                  <div className="ui labeled input field">
                    <div className="ui label">Lastname</div>
                    <input type="text" placeholder="Meissner"></input>
                  </div>
                </div>
                <div className="two fields">
                  <div className="ui labeled input field">
                    <div className="ui label">E-Mail</div>
                    <input type="text" placeholder="roy-meissner@gmx.net"></input>
                  </div>
                  <div className="ui labeled input field">
                    <div className="ui label">Language</div>
                    <input type="text" placeholder="German"></input>
                  </div>
                </div>
                <button type="submit" className="ui blue labeled submit icon button">
                  <i className="icon checkmark"></i>Submit Changes</button>
              </div>

              <div className="title">
                <i className="dropdown icon"></i> <i className="settings icon"></i>
                Integrations with other platforms
              </div>
              <div className="content">
                <p>This will be implemented later on.</p>
              </div>
            </div>
          </div>
        );
    }
}

UserSettings.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserSettings;
