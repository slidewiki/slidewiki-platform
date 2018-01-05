import React from 'react';
import classNames from 'classnames';
import { hashPassword } from '../../../configs/general';
import { FormattedMessage, defineMessages } from 'react-intl';
import changePassword from '../../../actions/user/userprofile/changePassword';

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.isLoading = false;
    }

    componentDidMount() {
        const messages = defineMessages({
            passwordMismatch: {
                id: 'ChangePassword.passwordMismatch',
                defaultMessage: 'Your passwords do not match',
            }
        });
        const changePasswordValidation = {
            fields: {
                newPassword: {
                    identifier: 'newPassword'
                },
                reenterPassword: {
                    identifier: 'reenterPassword',
                    rules: [{
                        type: 'match[newPassword]',
                        prompt: this.context.intl.formatMessage(messages.passwordMismatch)
                    }]
                }
            },
            onSuccess: this.handleChangePassword.bind(this)
        };
        $('.ui.form.changePassword')
            .form(changePasswordValidation);
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps changepasswd: wrongPassword, success, failure', this.props.failures.wrongPassword, this.props.dimmer.success, this.props.dimmer.failure);
        if ((this.props.failures.wrongPassword || this.props.dimmer.success || this.props.dimmer.failure)) {
            this.isLoading = false;
            if (this.props.dimmer.success) {
                this.refs.oldPassword.value = '';
                this.refs.newPassword.value = '';
                this.refs.reenterPassword.value = '';
            }
        }
    }

    handleChangePassword(e) {
        e.preventDefault();
        this.isLoading = true;
        this.forceUpdate();
        let payload = {
            oldpw: hashPassword(this.refs.oldPassword.value),
            newpw: hashPassword(this.refs.newPassword.value)
        };
        this.context.executeAction(changePassword, payload);
        return false;
    }

    render() {
        // console.log('render changepasswd: wrongPassword, success, failure', this.props.failures.wrongPassword, this.props.dimmer.success, this.props.dimmer.failure);
        const messages = defineMessages({
            passwordToolTipp: {
                id: 'ChangePassword.passwordToolTipp',
                defaultMessage: 'This is not the password you entered before - Please try again',
            },
            newPasswordTitle: {
                id: 'ChangePassword.newPasswordTitle',
                defaultMessage: 'Your password should contain 8 characters or more',
            }
        });
        let passwordClasses = classNames({
            'ui': true,
            'field': true,
            'error': this.props.failures.wrongPassword
        });
        let passwordClasses2 = classNames({
            'ui': true,
            'field': true
        });
        let formClasses = classNames({
            'ui': true,
            'loading': this.isLoading,
            'form': true,
            'changePassword': true
        });
        let passwordToolTipp = this.props.failures.wrongPassword ? this.context.intl.formatMessage(messages.passwordToolTipp) : undefined;
        return (
            <div>
                <form className={formClasses}>
                    <div className="two fields">
                        <div className={ passwordClasses } data-tooltip={ passwordToolTipp } data-position="top center" data-inverted="">
                            <label htmlFor="oldpasswd">
                              <FormattedMessage
                                id='ChangePassword.oldPassword'
                                defaultMessage='Old Password'
                              />
                            </label>
                            <input type="password" placeholder="******" ref="oldPassword" name="oldpasswd" required/>
                        </div>
                    </div>
                    <div className="two fields">
                        <div className={passwordClasses2}>
                            <label htmlFor="newpasswd1">
                              <FormattedMessage
                                id='ChangePassword.newPassword'
                                defaultMessage='New Password'
                              />
                            </label>
                            <input type="password" name="newpasswd1" placeholder="******" pattern=".{8,}" title={this.context.intl.formatMessage(messages.newPasswordTitle)} id="newPassword" name="newPassword" ref="newPassword" required/>
                        </div>
                        <div className={passwordClasses2}>
                            <label htmlFor="newpasswd2">
                              <FormattedMessage
                                id='ChangePassword.retypePassword'
                                defaultMessage='Retype Password'
                              />
                            </label>
                            <input type="password" name="newpasswd2" placeholder="******" pattern=".{8,}" title={this.context.intl.formatMessage(messages.newPasswordTitle)} id="reenterPassword" name="reenterPassword" ref="reenterPassword" required/>
                        </div>
                    </div>
                    <button type="submit" className="ui blue labeled submit icon button">
                        <i className="icon checkmark"/>
                        <FormattedMessage
                          id='ChangePassword.submitPassword'
                          defaultMessage='Submit Password'
                        />
                    </button>
                    <div className="ui error message"/>
                </form>
            </div>
        );
    }
}

ChangePassword.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

export default ChangePassword;
