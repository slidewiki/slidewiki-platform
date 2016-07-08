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
        $(this.refs.language).dropdown();
    }
    refreshAccordion(status) {
        $(this.refs.accordion).accordion('refresh');
        $(this.refs.language).dropdown('refresh');
    }

    render() {
        return (
          <div>
            <div className="ui styled fluid accordion" ref="accordion">

              <div className="active title">
                <i className="dropdown icon"/> <i className="user icon"/>
                Personal Data
              </div>
              <div className="active content ui">
                <div className="ui stackable vertically divided grid">

                  <div className="centered row">
                    <div className="eight wide column">
                      <img src="https://avatars2.githubusercontent.com/u/855967?v=3&s=460" className="ui small centered circular image"/>
                    </div>
                    <div className="eight wide column">
                      <div className="ui vertical buttons">
                        <button className="ui blue labeled icon button">
                          <i className="icon upload"/>Upload new Image
                        </button>
                        <div className="ui hidden divider"/>
                        <button className="ui green labeled icon button">
                          <i className="icon upload"/>Use Gravater Image
                        </button>
                        <div className="ui hidden divider"/>
                        <button className="ui red labeled icon button">
                          <i className="icon ban"/>Remove Image
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="sixteen wide column">

                      <div className="ui form">
                        <h2>About me</h2>
                        <div className="ui hidden divider"/>
                        <div className="two fields">
                          <div className="ui labeled input field">
                            <div className="ui label">Firstname</div>
                            <input type="text" placeholder="Roy"/>
                          </div>
                          <div className="ui labeled input field">
                            <div className="ui label">Lastname</div>
                            <input type="text" placeholder="Meissner"/>
                          </div>
                        </div>

                        <div className="two fields">
                          <div className="ui labeled input field">
                            <div className="ui label">E-Mail</div>
                            <input type="text" placeholder="roy-meissner@gmx.net"/>
                          </div>
                          <div className="ui field">
                            <div className="ui search selection dropdown field" ref="language">
                              <input type="hidden" name="language"/>
                              <i className="dropdown icon"/>
                              <div className="default text">Select Language</div>
                              <div className="menu">
                                <div className="item">Arabic</div>
                                <div className="item">Chinese</div>
                                <div className="item">Danish</div>
                                <div className="item">Dutch</div>
                                <div className="item">English</div>
                                <div className="item">French</div>
                                <div className="item">German</div>
                                <div className="item">Greek</div>
                                <div className="item">Hungarian</div>
                                <div className="item">Italian</div>
                                <div className="item">Japanese</div>
                                <div className="item">Korean</div>
                                <div className="item">Lithuanian</div>
                                <div className="item">Persian</div>
                                <div className="item">Polish</div>
                                <div className="item">Portuguese</div>
                                <div className="item">Russian</div>
                                <div className="item">Spanish</div>
                                <div className="item">Swedish</div>
                                <div className="item">Turkish</div>
                                <div className="item">Vietnamese</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="two fields">
                          <div className="ui labeled input field">
                            <div className="ui label">Location</div>
                            <input type="text" placeholder="Germany"/>
                          </div>
                          <div className="ui labeled input field">
                            <div className="ui label">Hometown</div>
                            <input type="text" placeholder="Leipzig"/>
                          </div>
                        </div>

                        <div className="two fields">
                          <div className="ui labeled input field">
                            <div className="ui label">Birthday</div>
                            <input type="date" min="1900-01-01" value="1990-09-11"/>
                          </div>
                        </div>

                        <button type="submit" className="ui blue labeled submit icon button">
                          <i className="icon checkmark"/>Submit Changes
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="sixteen wide column">
                      <h2>Password</h2>
                      <div className="ui hidden divider"/>
                      <div className="ui form">
                        <div className="two fields">
                          <div className="ui labeled input field">
                            <div className="ui label">Old Password</div>
                            <input type="password" placeholder="******"/>
                          </div>
                        </div>
                        <div className="two fields">
                          <div className="ui labeled input field">
                            <div className="ui label">New Password</div>
                            <input type="password" placeholder="******"/>
                          </div>
                          <div className="ui labeled input field">
                            <div className="ui label">Retype Password</div>
                            <input type="password" placeholder="******"/>
                          </div>
                        </div>
                        <button type="submit" className="ui blue labeled submit icon button">
                          <i className="icon checkmark"/>Submit Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="title">
                <i className="dropdown icon"/> <i className="settings icon"/>
                Integrations with other platforms
              </div>
              <div className="content">
                <p>This feature is currently missing. Please wait for future releases.</p>
                {/*Include a nested accordion covering Google, Github, ....*/}
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
