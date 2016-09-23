import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
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
            $('.dimmer.success').dimmer({//Show signup success message
                closable: false
            })
                .dimmer('toggle');
            ReactDOM.findDOMNode(this.refs.successCloseButton).focus();
        } else if (this.props.ResetPasswordStore.componentStatus === 'error') {
            $('.dimmer.error').dimmer({//Show error message
                closable: false
            })
                .dimmer('toggle');
            ReactDOM.findDOMNode(this.refs.errorCloseButton).focus();
        }
    }

    goHome() {
        this.context.executeAction(resetPasswordResetStore, { });
        this.context.executeAction(navigateAction, {//go to home page after registration
            url: '/'
        });
    }

    closeErrorDimmer() {
        this.refs.recaptcha.reset();// Reset recaptcha
        this.state.grecaptcharesponse = undefined;
        this.context.executeAction(resetPasswordResetStore, { });
        $('.dimmer.error') //Hide error message
            .dimmer('toggle');
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
        const successMessage1 = 'Your password is now an automated created one.';
        const successMessage2 = 'Please check your inbox.';

        let dimmerMessageSuccess = (// Success message
            <div className="ui page dimmer success">
                <div className="content">
                    <div className="center">
                        <h2 className="ui inverted icon header">
                            <i className="icon circular inverted blue mail outline"></i>
                            Success!
                        </h2>
                        <br/>
                        {successMessage1}
                        <br/>
                        {successMessage2}
                        <br/><br/>
                        <button type="button" className="ui blue button" onClick={this.goHome.bind(this)} ref="successCloseButton" >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );

        let dimmerMessageError = (// Error message
          <div className="ui page dimmer error">
              <div className="content">
                  <div className="center">
                      <h2 className="ui inverted icon header">
                          <i className="icon warning circle inverted red"></i>
                          Error! Please try again later.
                      </h2>
                      <br/>
                      {this.props.ResetPasswordStore.errorMessage}
                      <br/><br/>
                      <button type="button" className="ui blue button" onClick={this.closeErrorDimmer.bind(this)} ref="errorCloseButton" >
                          Close
                      </button>
                  </div>
              </div>
          </div>
        );

        const signUpLabelStyle = {width: '150px'};
        const recaptchaStyle = {display: 'inline-block'};
        const PUBLIC_KEY = '6LdNLyYTAAAAAINDsVZRKG_E3l3Dvpp5sKboR1ET'; // Public reCAPTCHA key

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
                {dimmerMessageSuccess}
                {dimmerMessageError}

                <div className="eight wide column">
                    <div className="ui blue padded center aligned segment">
                        <h2 className="ui dividing header">Reset Password {this.props.ResetPasswordStore.componentStatus} </h2>
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
                                <ReCAPTCHA style={recaptchaStyle} ref="recaptcha" sitekey={PUBLIC_KEY} onChange={this.onRecaptchaChange.bind(this)} aria-required="true"/>
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
