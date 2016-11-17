import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import {publicRecaptchaKey} from '../../configs/general';
import resetPassword from '../../actions/user/resetPassword';
import resetPasswordResetStore from '../../actions/user/resetPasswordResetStore';
import ResetPasswordStore from '../../stores/ResetPasswordStore';
import ReCAPTCHA from 'react-google-recaptcha';

class ResetPassword extends React.Component {
    componentDidMount() {
        //Form validation
        const validationRules = {
            fields: {
                email: {
                    identifier: 'email',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter your email address'
                    }, {
                        type: 'email',
                        prompt: 'Please enter a valid email address'
                    }]
                },
                reenteremail: {
                    identifier: 'reenteremail',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please reenter your email address'
                    }, {
                        type: 'match[email]',
                        prompt: 'Your emails do not match'
                    }]
                },
                recaptcha: {
                    identifier: 'recaptcha',
                    rules: [{
                        type: 'recaptcha',
                        prompt: 'Please verify that you\'re a human'
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
        if (this.props.ResetPasswordStore.componentStatus === 'pending') {
            swal({
                title: 'Success!',
                text: 'Your password is now an automated created one. Please check your inbox.',
                type: 'success',
                confirmButtonText: 'Close',
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
                title: 'Error',
                text: this.props.UserRegistrationStore.errorMessage,
                type: 'error',
                confirmButtonText: 'Close',
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
                title: 'Error',
                text: 'There was a special error. The page will now be reloaded.',
                type: 'error',
                confirmButtonText: 'Reload page',
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
                title: 'Information',
                text: 'This email address is unknown. Please check the spelling.',
                type: 'warning',
                confirmButtonText: 'Close',
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
        let language = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;

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

        return (
            <div className="ui page centered grid" >
                <div className="eight wide column">
                    <div className="ui blue padded center aligned segment">
                        <h2 className="ui dividing header">Reset Password</h2>
                        <form className="ui form" >
                            <div className={emailClasses} data-position="top center" data-inverted="">
                                <label style={signUpLabelStyle}>Email * </label>
                                <div className="ui icon input"><i className={emailIconClasses}/><input type="email" id="email" name="email" ref="email" placeholder="Email" aria-required="true"/></div>
                            </div>
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>Re-enter email * </label>
                                <div className="ui icon input"><input type="email" id="reenteremail" name="reenteremail" ref="reenteremail" placeholder="Re-enter email" aria-required="true" aria-required="true"/></div>
                            </div>
                            <div >
                                <input type="hidden" id="recaptcha" name="recaptcha"></input>
                                <ReCAPTCHA style={recaptchaStyle} ref="recaptcha" sitekey={publicRecaptchaKey} onChange={this.onRecaptchaChange.bind(this)} aria-required="true"/>
                            </div>
                            <div className="ui error message"></div>
                            <button type="submit" className="ui blue labeled submit icon button" >
                                <i className="icon send"/>Reset my password now
                            </button>
                        </form>
                        <br/>
                    </div>
                </div>
            </div>
        );
    }
}

ResetPassword.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ResetPassword = connectToStores(ResetPassword, [ResetPasswordStore], (context, props) => {
    return {
        ResetPasswordStore: context.getStore(ResetPasswordStore).getState()
    };
});
export default ResetPassword;
