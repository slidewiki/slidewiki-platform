import React from 'react';
import ReactDom from 'react-dom';
import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import { Microservices } from '../../../configs/microservices';
import userSignUp from '../../../actions/user/userSignUp';
import resetUserRegistrationStatus from '../../../actions/user/resetUserRegistrationStatus';
import UserRegistrationStore from '../../../stores/UserRegistrationStore';
import ReCAPTCHA from 'react-google-recaptcha';
import ReactDOM from 'react-dom';

class UserRegistration extends React.Component {
    componentDidMount() {
        //Form validations
        const signupValidation = {
            fields: {
                firstname: {
                    identifier: 'firstname',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter your first name'
                    }]
                },
                lastname: {
                    identifier: 'lastname',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter your last name'
                    }]
                },
                username: {
                    identifier: 'username',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please select your username'
                    }]
                },
                emailsignup: {
                    identifier: 'emailsignup',
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
                        type: 'match[emailsignup]',
                        prompt: 'Your emails do not match'
                    }]
                },
                passwordsignup: {
                    identifier: 'passwordsignup',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter a password'
                    }, {
                        type: 'regExp[/((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,})/]',
                        prompt: 'Your password should be 8 characters or more long, have at least one lowercase character, one uppercase character and one number'
                    }]
                },
                reenterpasswordsignup: {
                    identifier: 'reenterpasswordsignup',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter your password again'
                    }, {
                        type: 'match[passwordsignup]',
                        prompt: 'Your passwords do not match'
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
            onSuccess: this.handleSignUp.bind(this)
        };

        // Custom form validation rule for checking if recaptcha is solved
        $.fn.form.settings.rules.recaptcha = (() => {
            return (this.state !== null && this.state.grecaptcharesponse !== undefined);
        });

        $('.ui.form.signup').form(signupValidation);
        // stop the form from submitting normally
        $('.ui.form.signup').submit((e) => {
            e.preventDefault(); //usually use this, but below works best here.
            return false;
        });
    }

    componentDidUpdate() {
        if (this.props.UserRegistrationStore.registrationStatus === 'pending') {
            $('.dimmer.success').dimmer({
                closable: false
            })
                .dimmer('toggle');
            ReactDOM.findDOMNode(this.refs.successCloseButton).focus();
        } else if (this.props.UserRegistrationStore.registrationStatus === 'error') {
            $('.dimmer.error').dimmer({
                closable: false
            })
                .dimmer('toggle');
            ReactDOM.findDOMNode(this.refs.errorCloseButton).focus();
        }
    }

    goHome() {
        this.context.executeAction(resetUserRegistrationStatus, { });
        this.context.executeAction(navigateAction, {//go to home page after registration
            url: '/'
        });
    }

    closeErrorDimmer() {
        this.refs.recaptcha.reset();
        this.state.grecaptcharesponse = undefined;
        this.context.executeAction(resetUserRegistrationStatus, { });
        $('.dimmer.error')
            .dimmer('toggle');
    }

    handleSignUp() {
        let language = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
        // let username = $('#firstname').val().charAt(0).toLowerCase() + $('#lastname').val().toLowerCase();

        this.context.executeAction(userSignUp, {
            firstname: this.refs.firstname.value,
            lastname: this.refs.lastname.value,
            username: this.refs.username.value,
            language: language,
            email: this.refs.emailsignup.value,
            password: this.refs.passwordsignup.value,
            grecaptcharesponse: this.state.grecaptcharesponse
        });
    }

    onRecaptchaChange(response) {
        this.setState({
            'grecaptcharesponse': response
        });
    }

    render() {
        //TODO email confirmation
        // const successMessage1 = 'To complete the registration process you have to confirm your account. An email has been sent to your address.';
        // const successMessage2 = 'To confirm and activate your account please check your inbox and click on the link inside the email we just sent you.';
        const successMessage1 = 'Thank you. You have successfully registered.';
        const successMessage2 = 'Please sign in with your new credentials.';

        let dimmerMessageSuccess = (//pending message
            <div className="ui page dimmer success">
                <div className="content">
                    <div className="center">
                        <h2 className="ui inverted icon header">
                            <i className="icon circular inverted blue mail outline"></i>
                            Thanks for signing up!
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

        let dimmerMessageError = (//error message
          <div className="ui page dimmer error">
              <div className="content">
                  <div className="center">
                      <h2 className="ui inverted icon header">
                          <i className="icon warning circle inverted red"></i>
                          Error!
                      </h2>
                      <br/>
                      {this.props.UserRegistrationStore.errorMessage}
                      <br/><br/>
                      <button type="button" className="ui blue button" onClick={this.goHome.bind(this)} ref="errorCloseButton" >
                          Close
                      </button>
                  </div>
              </div>
          </div>
        );

        const signUpLabelStyle = {width: '150px'};
        const recaptchaStyle = {display: 'inline-block'};
        const PUBLIC_KEY = '6LdNLyYTAAAAAINDsVZRKG_E3l3Dvpp5sKboR1ET';


        return (
            <div className="ui page centered grid" >
                {dimmerMessageSuccess}
                {dimmerMessageError}

                <div className="eight wide column">
                    <div className="ui blue padded center aligned segment">
                        <h2 className="ui dividing header">Sign Up</h2>
                        <form className="ui form signup" >
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>First Name * </label>
                                <input type="text" id="firstname" name="firstname" ref="firstname" placeholder="First name" aria-required="true"/>
                            </div>
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>Last Name * </label>
                                <input type="text" id="lastname" name="lastname" ref="lastname" placeholder="Last name" aria-required="true"/>
                            </div>
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>Username * </label>
                                <input type="text" id="username" name="username" ref="username" placeholder="Username" aria-required="true"/>
                            </div>
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>Email * </label>
                                <input type="email" id="emailsignup" name="emailsignup" ref="emailsignup" placeholder="Email" aria-required="true"/>
                            </div>
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>Re-enter email * </label>
                                <input type="email" id="reenteremail" name="reenteremail" ref="reenteremail" placeholder="Re-enter email" aria-required="true" aria-required="true"/>
                            </div>
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>Password * </label>
                                <input type="password" id="passwordsignup" name="passwordsignup" ref="passwordsignup" placeholder="Password" aria-required="true"/>
                            </div>
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>Re-enter Password * </label>
                                <input type="password" id="reenterpasswordsignup" name="reenterpasswordsignup" ref="reenterpasswordsignup" placeholder="Re-enter Password" aria-required="true"/>
                            </div>
                            <div >
                                <input type="hidden" id="recaptcha" name="recaptcha"></input>
                                <ReCAPTCHA style={recaptchaStyle} ref="recaptcha" sitekey={PUBLIC_KEY} onChange={this.onRecaptchaChange.bind(this)} aria-required="true"/>
                            </div>
                            <div className="ui error message"></div>
                            <button type="submit" className="ui blue labeled submit icon button" >
                                <i className="icon add user"></i> Sign Up
                            </button>
                        </form>
                        <br/>
                        <div >
                            By clicking Sign Up, you agree to our <a href="">Terms</a>.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

UserRegistration.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
UserRegistration = connectToStores(UserRegistration, [UserRegistrationStore], (context, props) => {
    return {
        UserRegistrationStore: context.getStore(UserRegistrationStore).getState()
    };
});
export default UserRegistration;
