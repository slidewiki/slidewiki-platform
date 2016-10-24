import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import {Microservices} from '../../../configs/microservices';
import {publicRecaptchaKey} from '../../../configs/general';
import userSignUp from '../../../actions/user/registration/userSignUp';
import resetUserRegistrationStatus from '../../../actions/user/registration/resetUserRegistrationStatus';
import checkEmail from '../../../actions/user/registration/checkEmail';
import checkUsername from '../../../actions/user/registration/checkUsername';
import UserRegistrationStore from '../../../stores/UserRegistrationStore';
import ReCAPTCHA from 'react-google-recaptcha';
import {hashPassword} from '../../../configs/general';

class UserRegistration extends React.Component {
    componentDidMount() {
        //Form validation
        const validationRules = {
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
                    }, {
                        type: 'uniqueUsername',
                        prompt: 'The username is already in use'
                    }, {
                        type   : 'maxLength[64]',
                        prompt : 'Your username can not be longer than 64 characters'
                    }, {
                        type   : 'regExp[/^[a-z0-9]+$/i]',
                        prompt : 'The username must contain only alphanumeric characters'
                    }]
                },
                email: {
                    identifier: 'email',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter your email address'
                    }, {
                        type: 'email',
                        prompt: 'Please enter a valid email address'
                    }, {
                        type: 'uniqueEmail',
                        prompt: 'The email address is already in use'
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
                password: {
                    identifier: 'password',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter a password'
                    }, {
                        type: 'minLength[8]',
                        prompt: 'Your password should contain 8 characters or more'
                    }]
                },
                reenterpassword: {
                    identifier: 'reenterpassword',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter your password again'
                    }, {
                        type: 'match[password]',
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

        $.fn.form.settings.rules.uniqueEmail = (() => {
            const emailNotAllowed = this.props.UserRegistrationStore.failures.emailNotAllowed;
            return (emailNotAllowed !== undefined) ? !emailNotAllowed : true;
        });
        $.fn.form.settings.rules.uniqueUsername = (() => {
            const usernameNotAllowed = this.props.UserRegistrationStore.failures.usernameNotAllowed;
            return (usernameNotAllowed !== undefined) ? !usernameNotAllowed : true;
        });

        $('.ui.form').form(validationRules);

    }

    componentDidUpdate() {
        if (this.props.UserRegistrationStore.registrationStatus === 'pending') {
            swal({
                title: 'Thanks for signing up!',
                text: 'Thank you. You have successfully registered. Please sign in with your new credentials.',
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
        } else if (this.props.UserRegistrationStore.registrationStatus === 'error') {
            swal({
                title: 'Error!',
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
        }
    }

    goHome() {
        console.log('goHome called', this.context);
        this.context.executeAction(resetUserRegistrationStatus, { });
        this.context.executeAction(navigateAction, {//go to home page after registration
            url: '/'
        });
        return true;
    }

    closeErrorDimmer() {
        this.refs.recaptcha.reset();// Reset recaptcha
        this.state.grecaptcharesponse = undefined;
        this.context.executeAction(resetUserRegistrationStatus, { });
        return true;
    }

    handleSignUp(e) {
        e.preventDefault();
        let language = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
        if (language.length === 2) {
            language += '-' + language.toUpperCase();
        }
        // let username = $('#firstname').val().charAt(0).toLowerCase() + $('#lastname').val().toLowerCase();

        this.context.executeAction(userSignUp, {
            firstname: this.refs.firstname.value,
            lastname: this.refs.lastname.value,
            username: this.refs.username.value,
            language: language,
            email: this.refs.email.value,
            password: hashPassword(this.refs.password.value),
            grecaptcharesponse: this.state.grecaptcharesponse
        });
        return false;
    }

    onRecaptchaChange(response) {
        this.setState({
            'grecaptcharesponse': response
        });
    }

    checkEmail() {
        const email = this.refs.email.value;
        if (this.props.UserRegistrationStore.failures.usernameNotAllowed !== undefined || email !== '') {
            this.context.executeAction(checkEmail, {email: email});
        }
    }

    checkUsername() {
        const username = this.refs.username.value;
        if (this.props.UserRegistrationStore.failures.usernameNotAllowed !== undefined || username !== '') {
            this.context.executeAction(checkUsername, {username: username});
        }
    }

    render() {
        //TODO email confirmation
        // const successMessage1 = 'To complete the registration process you have to confirm your account. An email has been sent to your address.';
        // const successMessage2 = 'To confirm and activate your account please check your inbox and click on the link inside the email we just sent you.';
        const successMessage1 = 'Thank you. You have successfully registered.';
        const successMessage2 = 'Please sign in with your new credentials.';

        const signUpLabelStyle = {width: '150px'};
        const recaptchaStyle = {display: 'inline-block'};
        const PUBLIC_KEY = '6LdNLyYTAAAAAINDsVZRKG_E3l3Dvpp5sKboR1ET'; // Public reCAPTCHA key

        const emailNotAllowed = this.props.UserRegistrationStore.failures.emailNotAllowed;
        let emailClasses = classNames({
            'ui': true,
            'field': true,
            'inline': true,
            'error': (emailNotAllowed !== undefined) ? emailNotAllowed : false
        });
        let emailIconClasses = classNames({
            'icon': true,
            'inverted circular red remove': (emailNotAllowed !== undefined) ? emailNotAllowed : false,
            'inverted circular green checkmark': (emailNotAllowed !== undefined) ? !emailNotAllowed : false
        });
        let emailToolTipp = emailNotAllowed ? 'This E-Mail has already been used by someone else. Please choose another one.' : undefined;

        const usernameNotAllowed = this.props.UserRegistrationStore.failures.usernameNotAllowed;
        let usernameClasses = classNames({
            'ui': true,
            'field': true,
            'inline': true,
            'error': (usernameNotAllowed !== undefined) ? usernameNotAllowed : false
        });
        let usernameIconClasses = classNames({
            'icon': true,
            'inverted circular red remove': (usernameNotAllowed !== undefined) ? usernameNotAllowed : false,
            'inverted circular green checkmark': (usernameNotAllowed !== undefined) ? !usernameNotAllowed : false
        });
        let usernameToolTipp = usernameNotAllowed ? 'This Username has already been used by someone else. Please choose another one.' : undefined;
        if (this.props.UserRegistrationStore.suggestedUsernames.length > 0) {
            usernameToolTipp += '\n Here are some suggestions: ' + this.props.UserRegistrationStore.suggestedUsernames;
        }
        return (
            <div className="ui page centered grid" >
                <div className="eight wide column">
                    <div className="ui blue padded center aligned segment">
                        <h2 className="ui dividing header">Sign Up</h2>
                        <form className="ui form" >
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>First name * </label>
                                <div className="ui icon input"><input type="text" id="firstname" name="firstname" ref="firstname" placeholder="First name" autoFocus aria-required="true"/></div>
                            </div>
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>Last name * </label>
                                <div className="ui icon input"><input type="text" id="lastname" name="lastname" ref="lastname" placeholder="Last name" aria-required="true"/></div>
                            </div>
                            <div className={usernameClasses} data-tooltip={usernameToolTipp} data-position="top center" data-inverted="" onBlur={this.checkUsername.bind(this)}>
                                <label style={signUpLabelStyle}>Username * </label>
                                <div className="ui icon input"><i className={usernameIconClasses}/><input type="text" id="username" name="username" ref="username" placeholder="Username" aria-required="true"/></div>
                            </div>
                            <div className={emailClasses} data-tooltip={emailToolTipp} data-position="top center" data-inverted="" onBlur={this.checkEmail.bind(this)}>
                                <label style={signUpLabelStyle}>Email * </label>
                                <div className="ui icon input"><i className={emailIconClasses}/><input type="email" id="email" name="email" ref="email" placeholder="Email" aria-required="true"/></div>
                            </div>
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>Re-enter email * </label>
                                <div className="ui icon input"><input type="email" id="reenteremail" name="reenteremail" ref="reenteremail" placeholder="Re-enter email" aria-required="true" aria-required="true"/></div>
                            </div>
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>Password * </label>
                                <div className="ui icon input"><input type="password" id="password" name="password" ref="password" placeholder="Password" aria-required="true"/></div>
                            </div>
                            <div className="ui inline field">
                                <label style={signUpLabelStyle}>Re-enter password * </label>
                                <div className="ui icon input"><input type="password" id="reenterpassword" name="reenterpassword" ref="reenterpassword" placeholder="Re-enter password" aria-required="true"/></div>
                            </div>
                            <div >
                                <input type="hidden" id="recaptcha" name="recaptcha"></input>
                                <ReCAPTCHA style={recaptchaStyle} ref="recaptcha" sitekey={publicRecaptchaKey} onChange={this.onRecaptchaChange.bind(this)} aria-required="true"/>
                            </div>
                            <div className="ui error message"></div>
                            <button type="submit" className="ui blue labeled submit icon button" >
                                <i className="icon add user"/> Sign Up
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
