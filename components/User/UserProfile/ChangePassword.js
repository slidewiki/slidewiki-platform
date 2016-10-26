import React from 'react';
import classNames from 'classnames';
import changePassword from '../../../actions/user/userprofile/changePassword';
import {hashPassword} from '../../../configs/general';

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
        $('.ui.form.changePassword')
            .form(changePasswordValidation);
    }

    componentDidUpdate() {}

    handleChangePassword(e) {
        e.preventDefault();
        let payload = {
            oldpw: hashPassword(this.refs.oldPassword.value),
            newpw: hashPassword(this.refs.newPassword.value)
        };
        this.refs.oldPassword.value = '';
        this.refs.newPassword.value = '';
        this.refs.reenterPassword.value = '';
        this.context.executeAction(changePassword, payload);
        return false;
    }

    render() {
        let passwordClasses = classNames({
            'ui': true,
            'field': true,
            'error': this.props.failures.wrongPassword
        });
        let passwordToolTipp = this.props.failures.wrongPassword ? 'This is not the password you entered before - Please try again' : undefined;
        return (
            <div>
                <form className="ui form changePassword">
                    <div className="two fields">
                        <div className={ passwordClasses } data-tooltip={ passwordToolTipp } data-position="top center" data-inverted="">
                            <label>Old Password</label>
                            <input type="password" placeholder="******" ref="oldPassword" required/>
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="ui field">
                            <label>New Password</label>
                            <input type="password" placeholder="******" pattern=".{8,}" title="Your password should contain 8 characters or more" id="newPassword" name="newPassword" ref="newPassword" required/>
                        </div>
                        <div className="ui field">
                            <label>Retype Password</label>
                            <input type="password" placeholder="******" pattern=".{8,}" title="Your password should contain 8 characters or more" id="reenterPassword" name="reenterPassword" ref="reenterPassword" required/>
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
