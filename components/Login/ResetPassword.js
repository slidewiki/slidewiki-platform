import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import {publicRecaptchaKey} from '../../configs/general';
import resetPassword from '../../actions/user/resetPassword';
import resetPasswordResetStore from '../../actions/user/resetPasswordResetStore';
import ResetPasswordStore from '../../stores/ResetPasswordStore';
import { FormattedMessage, defineMessages } from 'react-intl';
import ReCAPTCHA from 'react-google-recaptcha';
import common from '../../common';

let MediaQuery = require ('react-responsive');

class ResetPassword extends React.Component {
    componentDidMount() {
        const messages = defineMessages({
            mailprompt: {
                id: 'resetPassword.mailprompt',
                defaultMessage: 'Please enter your email address',
            },
            mailprompt2: {
                id: 'resetPassword.mailprompt2',
                defaultMessage: 'Please enter a valid email address',
            },
            mailreprompt: {
                id: 'resetPassword.mailreprompt',
                defaultMessage: 'Please reenter your email address',
            },
            mailreprompt2: {
                id: 'resetPassword.mailreprompt2',
                defaultMessage: 'Your emails do not match',
            },
            captchaprompt: {
                id: 'resetPassword.captchaprompt',
                defaultMessage: 'Please verify that you\'re a human',
            },
        });
        //Form validation
        const validationRules = {
            fields: {
                email: {
                    identifier: 'email',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(messages.mailprompt)
                    }, {
                        type: 'email',
                        prompt: this.context.intl.formatMessage(messages.mailprompt2)
                    }]
                },
                reenteremail: {
                    identifier: 'reenteremail',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(messages.mailreprompt)
                    }, {
                        type: 'match[email]',
                        prompt: this.context.intl.formatMessage(messages.mailreprompt2)
                    }]
                },
                recaptcha: {
                    identifier: 'recaptcha',
                    rules: [{
                        type: 'recaptcha',
                        prompt: this.context.intl.formatMessage(messages.captchaprompt)
                    }]
                }
            },
            onSuccess: this.handleClick.bind(this)
        };

        // Custom form validation rule for checking if recaptcha is solved
        $.fn.form.settings.rules.recaptcha = (() => {
            return (this.state !== null && this.state.grecaptcharesponse !== undefined);
        });

        $('.ui.form').form(validationRules);

    }

    componentDidUpdate() {
        const messages = defineMessages({
            swalTitle1: {
                id: 'resetPassword.swalTitle1',
                defaultMessage: 'Success!',
            },
            swalText1: {
                id: 'resetPassword.swalText1',
                defaultMessage: 'Your password is now an automated created one. Please check your inbox.',
            },
            swalClose1: {
                id: 'resetPassword.swalClose1',
                defaultMessage: 'Close',
            },
            swalTitle2: {
                id: 'resetPassword.swalTitle2',
                defaultMessage: 'Error',
            },
            swalText2: {
                id: 'resetPassword.swalText2',
                defaultMessage: 'There was a special error. The page will now be reloaded.',
            },
            swalButton2: {
                id: 'resetPassword.swalButton2',
                defaultMessage: 'Reload page',
            },
            swalTitle3: {
                id: 'resetPassword.swalTitle3',
                defaultMessage: 'Information',
            },
            swalText3: {
                id: 'resetPassword.swalText3',
                defaultMessage: 'This email address is unknown. Please check the spelling.',
            },
        });
        if (this.props.ResetPasswordStore.componentStatus === 'pending') {
            swal({
                title: this.context.intl.formatMessage(messages.swalTitle1),
                text: this.context.intl.formatMessage(messages.swalText1),
                type: 'success',
                confirmButtonText: this.context.intl.formatMessage(messages.swalClose1),
                confirmButtonClass: 'positive ui button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            })
            .then(() => {
                return this.goHome();
            });
        } else if (this.props.ResetPasswordStore.componentStatus === 'error') {
            swal({
                title: this.context.intl.formatMessage(messages.swalTitle2),
                text: this.props.ResetPasswordStore.errorMessage,
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(messages.swalClose1),
                confirmButtonClass: 'negative ui button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            })
            .then(() => {
                return this.closeErrorDimmer();
            });
        } else if (this.props.ResetPasswordStore.componentStatus === 'apikey') {
            swal({
                title: this.context.intl.formatMessage(messages.swalTitle2),
                text: this.context.intl.formatMessage(messages.swalText2),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(messages.swalButton2),
                confirmButtonClass: 'negative ui button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            })
            .then(() => {
                location.reload();
                return true;
            });
        } else if (this.props.ResetPasswordStore.componentStatus === 'email') {
            swal({
                title: this.context.intl.formatMessage(messages.swalTitle3),
                text: this.context.intl.formatMessage(messages.swalText3),
                type: 'warning',
                confirmButtonText: this.context.intl.formatMessage(messages.swalClose1),
                confirmButtonClass: 'ui orange button',
                allowEscapeKey: true,
                allowOutsideClick: true,
                buttonsStyling: false
            })
            .then(() => {
                return true;
            });
        }
    }

    goHome() {
        this.context.executeAction(resetPasswordResetStore, { });
        this.context.executeAction(navigateAction, {//go to home page after password reset
            url: '/'
        });
        $('.ui.login.modal').modal('show');
        return true;
    }

    closeErrorDimmer() {
        this.refs.recaptcha.reset();// Reset recaptcha
        this.state.grecaptcharesponse = undefined;
        this.context.executeAction(resetPasswordResetStore, { });
        return true;
    }

    handleClick(e) {
        e.preventDefault();
        let language = common.getIntlLanguage();

        this.context.executeAction(resetPassword, {
            language: language,
            email: this.refs.email.value,
            grecaptcharesponse: this.state.grecaptcharesponse
        });
        return false;
    }

    onRecaptchaChange(response) {
        this.setState({
            'grecaptcharesponse': response
        });
    }

    render() {
        const signUpLabelStyle = {width: '150px'};
        const recaptchaStyle = {display: 'inline-block'};

        let emailClasses = classNames({
            'ui': true,
            'field': true,
            'inline': true
        });
        let emailIconClasses = classNames({
            'icon': true
        });

        let content = <div className="ui blue padded center aligned segment">
            <h2 className="ui dividing header">
              <FormattedMessage
                id='resetPassword.resetPW'
                defaultMessage='Reset Password'
              />
            </h2>
            <form className="ui form" >
                <div className={emailClasses} data-position="top center" data-inverted="">
                    <label style={signUpLabelStyle}>
                      <FormattedMessage
                        id='resetPassword.mail'
                        defaultMessage='Email * '
                      />
                    </label>
                    <div className="ui icon input"><i className={emailIconClasses}/><input type="email" id="email" name="email" ref="email" placeholder="Email" aria-required="true"/></div>
                </div>
                <div className="ui inline field">
                    <label style={signUpLabelStyle}>
                      <FormattedMessage
                        id='resetPassword.remail'
                        defaultMessage='Re-enter email * '
                      />
                    </label>
                    <div className="ui icon input"><input type="email" id="reenteremail" name="reenteremail" ref="reenteremail" placeholder="Re-enter email" aria-required="true" aria-required="true"/></div>
                </div>
                <div >
                    <input type="hidden" id="recaptcha" name="recaptcha"></input>
                    <ReCAPTCHA style={recaptchaStyle} ref="recaptcha" sitekey={publicRecaptchaKey} onChange={this.onRecaptchaChange.bind(this)} aria-required="true"/>
                </div>
                <div className="ui error message"></div>

                {this.props.ResetPasswordStore.isLoading ? <div className="ui active dimmer"><div className="ui text loader">
                  <FormattedMessage
                    id='resetPassword.loading'
                    defaultMessage='Loading'
                  />
                </div></div> : ''}

                <button type="submit" className="ui blue labeled submit icon button" >
                    <i className="icon send"/>
                    <FormattedMessage
                      id='resetPassword.reset'
                      defaultMessage='Reset my password now'
                    />
                </button>
            </form>
            <br/>
        </div>;

        return (
            <div className="ui page centered padded grid" >
              <MediaQuery minDeviceWidth={1024} values={{deviceWidth: 1600}}>
                <div className="eight wide column">
                  {content}
                </div>
              </MediaQuery>
              <MediaQuery minDeviceWidth={768} maxDeviceWidth={1023}>
                <div className="ten wide column">
                  {content}
                </div>
              </MediaQuery>
              <MediaQuery maxDeviceWidth={767}>
                <div className="sixteen wide column">
                  {content}
                </div>
              </MediaQuery>
            </div>
        );
    }
}

ResetPassword.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};
ResetPassword = connectToStores(ResetPassword, [ResetPasswordStore], (context, props) => {
    return {
        ResetPasswordStore: context.getStore(ResetPasswordStore).getState()
    };
});
export default ResetPassword;
