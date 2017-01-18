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
import newSocialData from '../../../actions/user/registration/newSocialData';
import UserRegistrationStore from '../../../stores/UserRegistrationStore';
import UserRegistrationSocial from './UserRegistrationSocial';
import ReCAPTCHA from 'react-google-recaptcha';
import {hashPassword} from '../../../configs/general';
import common from '../../../common';

const MODI = 'sociallogin_modi';
const NAME = 'sociallogin_data';

class UserRegistration extends React.Component {
    constructor(props) {
        super(props);
        this.provider = '';

        this.handleNoAccessClick = this.handleNoAccessClick.bind(this);
    }

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

        $(ReactDOM.findDOMNode(this.refs.UserRegistration_form)).form(validationRules);
    }

    componentWillReceiveProps(nextProps) {
        // console.log('UserRegistration componentWillReceiveProps()', this.props.UserRegistrationStore.socialuserdata, nextProps.UserRegistrationStore.socialuserdata);
        if (localStorage.getItem(MODI) === 'login_failed' && nextProps.UserRegistrationStore.socialuserdata.email === undefined && nextProps.UserRegistrationStore.socialuserdata.username === undefined) {
            this.setUserdata({}, false);
            return;
        }
        if (nextProps.UserRegistrationStore.socialCredentialsTaken && !this.props.UserRegistrationStore.socialCredentialsTaken) {
            $(ReactDOM.findDOMNode(this.refs.modal_social.refs.wrappedElement.refs.SocialRegistration_Modal)).modal('hide');
            window.scrollTo(0,0);

            swal({
                title: 'Information',
                text: 'Signing up with a provider failed because the user of this provider is already registered at SlideWiki. Either log in with this provider or register with another one.',
                type: 'question',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Login',
                confirmButtonClass: 'positive ui button',
                cancelButtonText: 'Register',
                cancelButtonClass: 'ui orange button',
                buttonsStyling: false
            })
            .then((dismiss) => {
                if (dismiss === 'cancel')
                    return true;

                this.context.executeAction(navigateAction, {
                    url: '/'
                });

                $('.ui.login.modal').modal('show');

                return true;
            })
            .catch(() => {
                return true;
            });
        }
        else if (nextProps.UserRegistrationStore.socialCredentialsTakenByDeactivatedAccount && !this.props.UserRegistrationStore.socialCredentialsTakenByDeactivatedAccount) {
            $(ReactDOM.findDOMNode(this.refs.modal_social.refs.wrappedElement.refs.SocialRegistration_Modal)).modal('hide');
            window.scrollTo(0,0);

            swal({
                title: 'Information',
                text: 'These provider credentials are already used by a deactivated user. To reactivate a specific user please contact us directly.',
                type: 'error',
                showCloseButton: true,
                showCancelButton: false,
                confirmButtonText: 'Confirm',
                confirmButtonClass: 'positive ui button',
                buttonsStyling: false
            })
            .then((dismiss) => {
                return true;
            })
            .catch(() => {
                return true;
            });
        }
        else if (nextProps.UserRegistrationStore.socialuserdata && localStorage.getItem(MODI) === 'login_failed_register_now') {
            if ((nextProps.UserRegistrationStore.socialuserdata.username && !(this.refs.username.value)) || (nextProps.UserRegistrationStore.socialuserdata.email && !(this.refs.email.value)))
                this.setUserdata(nextProps.UserRegistrationStore.socialuserdata);
        }
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

        let language = common.getBrowserLanguage();

        // let username = $('#firstname').val().charAt(0).toLowerCase() + $('#lastname').val().toLowerCase();

        localStorage.setItem(MODI, '');

        let data = {};
        try {
            data = {
                firstname: this.refs.firstname.value,
                lastname: this.refs.lastname.value,
                username: this.refs.username.value,
                language: language,
                email: this.refs.email.value,
                password: hashPassword(this.refs.password.value),
                grecaptcharesponse: this.state.grecaptcharesponse
            };
        } catch (e) {
            //somehow this is sometimes called when doing login
            return false;
        }

        this.context.executeAction(userSignUp, data);
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

    socialRegister(provider, e) {
        e.preventDefault();
        // console.log('Hit on social register icon', provider);

        //delete old data
        this.context.executeAction(newSocialData, {});

        //prepare localStorage
        localStorage.setItem(MODI, 'register');
        localStorage.setItem(NAME, '');

        this.provider = provider;

        //observe storage
        $(window).off('storage').on('storage', this.handleStorageEvent.bind(this));

        //create new tab
        let url = 'http://authorizationservice.manfredfris.ch:3000/connect/' + provider;

        let width = screen.width*0.75, height = screen.height*0.75;
        if (width < 600)
            width = screen.width;
        if (height < 500)
            height = screen.height;
        let left = screen.width/2-width/2, topSpace = screen.height/2-height/2;

        let win = window.open(url, '_blank', 'width='+width+',height='+height+',left='+left+',top='+topSpace+',toolbar=No,location=No,scrollbars=no,status=No,resizable=no,fullscreen=No');
        win.focus();
    }

    handleStorageEvent(e) {
        // console.log('storage event', e.key, localStorage.getItem(e.key));
        //this is available

        if (e.key !== NAME || localStorage.getItem(MODI) !== 'register')
            return false;

        let data = {};
        try {
            data = JSON.parse(localStorage.getItem(e.key));
        } catch (err) {
            console.log('Error while parsing data', err);
            return false;
        }
        finally {
            //delete data
            localStorage.setItem(NAME, '');
        }

        //add language before send to service
        let language = common.getBrowserLanguage();
        data.language = language;

        //check data - valid and not empty
        if ( (data.token.length < 1)
          || (data.provider.length < 3)
          || (data.token_creation.length < 22) )
            //Failure
            return false;

        if  (data.email.indexOf('@') === -1 || data.email.indexOf('.') === -1 || data.email.length < 5) {
            //show hint
            const provider = this.getProviderName();
            swal({
                title: 'Error',
                text: 'The data from ' + provider + ' was incomplete. In case you want to use this provider, please add an e-mail address at the provider itself and try again at SlideWiki.',
                type: 'error',
                confirmButtonText: 'Confirm',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then().catch();
            return false;
        }

        this.context.executeAction(newSocialData, data);

        $(ReactDOM.findDOMNode(this.refs.modal_social.refs.wrappedElement.refs.SocialRegistration_Modal)).modal({
            closable  : false,
            onDeny    : function(){
                //nothing
                return true;
            }
        }).modal('show');

        return true;
    }

    setUserdata(data, check = true) {
        // console.log('UserRegistration setUserdata()', data);

        this.provider = data.provider;

        this.refs.username.value = data.username || '';
        this.refs.email.value = data.email || '';
        let name = data.name || '';
        if (name.indexOf(' ') !== -1) {
            this.refs.firstname.value = data.forename || name.split(' ')[0];
            this.refs.lastname.value = data.surname || name.substring(name.indexOf(' '));
        }

        if (check) {
            this.checkUsername();
            this.checkEmail();
        }
    }

    getProviderName() {
        if (this.provider.length < 1)
            return '';
        return this.provider.charAt(0).toUpperCase() + this.provider.slice(1);
    }

    handleNoAccessClick(e) {
        e.preventDefault();
        this.context.executeAction(navigateAction, {
            url: '/resetpassword'
        });
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
          <div>
            <div className="ui page centered grid" >
                <div className="eight wide column">
                    <div className="ui blue padded center aligned segment">
                        <h2 className="ui dividing header">Sign Up</h2>
                        <form className="ui form" ref="UserRegistration_form" >
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
                            <br/>
                            <button type="submit" className="ui blue labeled submit icon button" >
                                <i className="icon add user"/> Sign Up
                            </button>
                        </form>
                        <div className="ui dividing header" ></div>
                        By clicking Sign Up, you agree to our <a href="">Terms</a>.
                        <br/><br/>
                        <a href="#" onClick={this.handleNoAccessClick}>I can not access my account</a>
                    </div>
                </div>
                <div className="seven wide column">
                    <div className="ui blue padded center aligned segment">
                        <h2 className="ui dividing header">Sign Up with a Social Provider</h2>

                        <div className="container">
                            <i className="big circular facebook square link icon" onClick={this.socialRegister.bind(this, 'facebook')} ></i>
                            <i className="big circular google plus link icon" onClick={this.socialRegister.bind(this, 'google')} ></i>
                            <i className="big circular github link icon" onClick={this.socialRegister.bind(this, 'github')} ></i>
                        </div>
                        <div className="ui dividing header" ></div>
                        By clicking on a Social Provider, you agree to our <a href="">Terms</a>.
                        <br/><br/>
                        <a href="#" onClick={this.handleNoAccessClick}>I can not access my account</a>
                    </div>
                </div>
            </div>

            <UserRegistrationSocial ref="modal_social"/>

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
