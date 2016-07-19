import React from 'react';
import ReactDom from 'react-dom';
import AccountDeletion from './AccountDeletion';
import ChangePassword from './ChangePassword';
import ChangePersonalData from './ChangePersonalData';
import Picture from './Picture';

class UserSettings extends React.Component {
    componentDidMount() {
        this.enableAccordion();

        $('.ui.form.userdata').submit((e) => {
            e.preventDefault();
            return false;
        });
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
    handleChangePassword(){}

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

                  <div className="row">
                    <div className="sixteen wide column">
                    <Picture />
                    </div>
                  </div>

                  <div className="row">
                    <div className="sixteen wide column">
                      <ChangePersonalData />
                    </div>
                  </div>

                  <div className="row">
                    <div className="sixteen wide column">
                      <ChangePassword />
                    </div>
                  </div>
                </div>
              </div>

              <div className="title">
                <i className="dropdown icon"/> <i className="settings icon"/>
                Integrations with other platforms
              </div>
              <div className="content">
                <p>This feature is currently missing. Please wait for future releases of SlideWiki.</p>
                {/*Include a nested accordion covering Google, Github, ....*/}
              </div>

              <div className="title">
                <i className="dropdown icon"/> <i className="ban icon"/>
                Delete my account
              </div>
              <div className="content">
                <AccountDeletion />
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
