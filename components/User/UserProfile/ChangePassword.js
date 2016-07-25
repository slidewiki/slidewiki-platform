import React from 'react';

class ChangePassword extends React.Component {
    componentDidMount() {
        const changePasswordValidation = {
            fields: {
                newPassword: {
                    identifier: 'newPassword'
                },
                reenterPassword: {
                    identifier: 'reenterPassword',
                    rules: [{
                        type: 'match[newPassword]',
                        prompt: 'Your passwords do not match'
                    }]
                }
            },
            onSuccess: this.handleChangePassword.bind(this)
        };
        $('.ui.form.changePassword').form(changePasswordValidation);
    }

    componentDidUpdate() {}

    handleChangePassword(e) {
        e.preventDefault();
        return false;
    }

    render() {
        return (
          <div>
            <h2>Password</h2>
            <div className="ui hidden divider"/>
            <form className="ui form changePassword" onSubmit={ this.handleChangePassword.bind(this) } ref="changePassword">
              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">Old Password</div>
                  <input type="password" placeholder="******" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}" title="8 characters or more, at least one lowercase character, one uppercase character and one number" required/>
                </div>
              </div>
              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">New Password</div>
                  <input type="password" placeholder="******" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}" title="8 characters or more, at least one lowercase character, one uppercase character and one number" id="newPassword" name="newPassword" ref="newPassword" required/>
                </div>
                <div className="ui labeled input field">
                  <div className="ui label">Retype Password</div>
                  <input type="password" placeholder="******" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}" title="8 characters or more, at least one lowercase character, one uppercase character and one number" id="reenterPassword" name="reenterPassword" ref="reenterPassword" required/>
                </div>
              </div>
              <button type="submit" className="ui blue labeled submit icon button">
                <i className="icon checkmark"/>Submit Password
              </button>
              <div className="ui error message"/>
            </form>
          </div>
        );
    }
}

ChangePassword.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ChangePassword;
