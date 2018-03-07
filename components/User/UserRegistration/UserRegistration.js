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
import {hashPassword, ssoEnabled} from '../../../configs/general';
import common from '../../../common';
import openSSOModal from '../../../actions/user/openSSOModal';
import {defineMessages} from 'react-intl';

let MediaQuery = require ('react-responsive');

const MODI = 'sociallogin_modi';
const NAME = 'sociallogin_data';

class UserRegistration extends React.Component {
    constructor(props) {
        /* Uses: this.props.UserRegistrationStore.errorMessage
           this message should be translated in the origin
        */
        super(props);
        this.provider = '';

        this.handleNoAccessClick = this.handleNoAccessClick.bind(this);

        this.messages = defineMessages({
            firstName_prompt:{
                id: 'UserRegistration.firstName_prompt',
                defaultMessage:'Please enter your first name'
            },
            lastName_prompt:{
                id: 'UserRegistration.lastName_prompt',
                defaultMessage:'Please enter your last name'
            },
            userName_prompt:{
                id: 'UserRegistration.userName_prompt',
                defaultMessage:'Please select your username'
            },
            uniqueUsername_error:{
                id: 'UserRegistration.uniqueUsername_error',
                defaultMessage:'The username is already in use'
            },
            maxLengthUsername_error:{
                id: 'UserRegistration.maxLengthUsername_error',
                defaultMessage:'Your username can not be longer than 64 characters'
            },
            wrongExpressionUsername_error:{
                id: 'UserRegistration.wrongExpressionUsername_error',
                defaultMessage:'The username must contain only alphanumeric characters plus the following: _ . - ~'
            },
            email_prompt:{
                id:'UserRegistration.email_prompt',
                defaultMessage:'Please enter your email address'
            },
            wrongExpressionEmail_error:{
                id:'UserRegistration.wrongExpressionEmail_error',
                defaultMessage:'Please enter a valid email address'

            },
            uniqueEmail_error:{
                id:'UserRegistration.uniqueEmail_error',
                defaultMessage:'The email address is already in use'

            },
            reenteremail_prompt:{
                id:'UserRegistration.reenteremail_prompt',
                defaultMessage:'Please re-enter your email address'
            },
            noMatchReenteremail_error:{
                id:'noMatchReenteremail_error',
                defaultMessage:'Your email address does not match'

            },
            password_prompt:{
                id:'UserRegistration.password_prompt',
                defaultMessage:'Please enter a password'

            },
            minLengthPassword_error:{
                id:'UserRegistration.minLengthPassword_error',
                defaultMessage:'Your password should contain 8 characters or more'

            },
            reenterPassword_prompt:{
                id:'UserRegistration.reenterPassword_prompt',
                defaultMessage:'Please enter your password again'

            },
            noMatchReenterPassword_error:{
                id:'UserRegistration.noMatchReenterPassword_error',
                defaultMessage:'Your password does not match'

            },
            recaptcha_prompt:{
                id:'UserRegistration.recaptcha_prompt',
                defaultMessage:'Please verify that you are a human'
            },
            swal_title:{
                id:'UserRegistration.swal_title',
                defaultMessage:'Information'

            },
            swal_text:{
                id:'UserRegistration.swal_text',
                defaultMessage:'Signing up with this provider failed because you are already registered at SlideWiki with this provider. Either sign in or sign up with another provider if you wish to create a new account.'
            },
            swal_confirmButton:{
                id:'UserRegistration.swal_confirmButton',
                defaultMessage:'Login'
            },
            swal_cancelButton:{
                id:'UserRegistration.swal_cancelButton',
                defaultMessage:'Register'
            },
            swal2_confirmButton:{
                id:'UserRegistration.swal2_confirmButton',
                defaultMessage:'Ok'
            },
            swal2_text:{
                id:'UserRegistration.swal2_text',
                defaultMessage:'These provider credentials are already used by a deactivated user. To reactivate a specific user please contact us directly.',
            },
            swal3_title:{
                id:'UserRegistration.swal3_title',
                defaultMessage:'Thanks for signing up!'

            },
            swal3_text:{
                id:'UserRegistration.swal3_text',
                defaultMessage:'Thank you. You have successfully registered. Please sign in with your new credentials.'
            },
            swal3_confirmButton:{
                id:'UserRegistration.swal3_confirmButton',
                defaultMessage:'Close'

            },
            swal4_title:{
                id:'UserRegistration.swal4_title',
                defaultMessage:'Error!',
            },
            /*
            swal4_text:{ //not accepted by intl
                id:'UserRegistration.swal4_text',
                defaultMessage:this.props.UserRegistrationStore.errorMessage,
            },
            */
            swal5_title:{
                id:'UserRegistration.swal5_title',
                defaultMessage:'Error'
            },
            swal5_text:{
                id:'UserRegistration.swal5_text',
                defaultMessage:'The data from ',

            },
            swal5_text2:{
                id:'UserRegistration.swal5_text2',
                defaultMessage:' was incomplete. In case you want to use this provider, please add an e-mail address at the provider itself and try again.',

            },
            swal5_confirmButton:{
                id:'UserRegistration.swal5_confirmButton',
                defaultMessage:'Confirm'

            },
            modal_title:{
                id:'UserRegistration.modal_title',
                defaultMessage:'Sign Up',
            },
            modal_subtitle:{
                id:'UserRegistration.modal_subtitle',
                defaultMessage:'Sign Up with a Social Provider',
            },
            modal_googleButton:{
                id:'UserRegistration.modal_googleButton',
                defaultMessage:'Sign up with Google'
            },
            modal_githubButton:{
                id:'UserRegistration.modal_githubButton',
                defaultMessage:'Sign up with Github'
            },
            modal_termText1:{
                id:'UserRegistration.modal_termText1',
                defaultMessage:'By clicking on a Social Provider, you agree to our '
            },
            modal_termText2:{
                id:'UserRegistration.modal_termText2',
                defaultMessage:'Terms'
            },
            modal_termLinkTitle:{
                id:'UserRegistration.modal_termLinkTitle',
                defaultMessage:'Sign-up terms and conditions'
            },
            modal_subtitle2:{
                id:'UserRegistration.modal_subtitle2',
                defaultMessage:'Or complete the registration form'
            },
            form_firstName:{
                id:'UserRegistration.form_firstName',
                defaultMessage:'First name'
            },
            form_lastName:{
                id:'UserRegistration.form_lastName',
                defaultMessage:'Last name'
            },
            form_userName:{
                id:'UserRegistration.form_userName',
                defaultMessage:'User name'
            },
            form_email:{
                id:'UserRegistration.form_email',
                defaultMessage:'Email'
            },
            form_reenterEmail:{
                id:'UserRegistration.form_reenterEmail',
                defaultMessage:'Re-enter email'
            },
            form_password:{
                id:'UserRegistration.form_password',
                defaultMessage:'Password'
            },
            form_reenterPassword:{
                id:'UserRegistration.form_reenterPassword',
                defaultMessage:'Re-enter password'
            },
            form_submitButton:{
                id:'UserRegistration.form_submitButton',
                defaultMessage:'Sign Up'
            },
            form_terms:{
                id:'UserRegistration.form_terms',
                defaultMessage:'By clicking Sign Up, you agree to our'
            },
            form_terms2:{
                id:'UserRegistration.form_terms2',
                defaultMessage:'Terms'
            },
            form_noAccess:{
                id:'UserRegistration.noAccess',
                defaultMessage:'I can not access my account'
            }
        });
    }

    componentDidMount() {
        //Form validation
        const validationRules = {
            fields: {
                firstname: {
                    identifier: 'firstname',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(this.messages.firstName_prompt),
                    }]
                },
                lastname: {
                    identifier: 'lastname',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(this.messages.lastName_prompt)
                    }]
                },
                username: {
                    identifier: 'username',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(this.messages.userName_prompt)
                    }, {
                        type: 'uniqueUsername',
                        prompt: this.context.intl.formatMessage(this.messages.uniqueUsername_error)
                    }, {
                        type   : 'maxLength[64]',
                        prompt : this.context.intl.formatMessage(this.messages.maxLengthUsername_error)
                    }, {
                        type   : 'regExp[/^[a-zA-Z0-9-.~_]+$/i]',
                        prompt : this.context.intl.formatMessage(this.messages.wrongExpressionUsername_error)
                    }]
                },
                email: {
                    identifier: 'email',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(this.messages.email_prompt)
                    }, {
                        type   : 'regExp[/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+$/]',
                        prompt : this.context.intl.formatMessage(this.messages.wrongExpressionEmail_error)
                    }, {
                        type: 'uniqueEmail',
                        prompt: this.context.intl.formatMessage(this.messages.uniqueEmail_error)
                    }]
                },
                reenteremail: {
                    identifier: 'reenteremail',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(this.messages.reenteremail_prompt)
                    }, {
                        type: 'match[email]',
                        prompt: this.context.intl.formatMessage(this.messages.noMatchReenteremail_error)
                    }]
                },
                password: {
                    identifier: 'password',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(this.messages.password_prompt)
                    }, {
                        type: 'minLength[8]',
                        prompt: this.context.intl.formatMessage(this.messages.minLengthPassword_error)
                    }]
                },
                reenterpassword: {
                    identifier: 'reenterpassword',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(this.messages.reenterPassword_prompt)
                    }, {
                        type: 'match[password]',
                        prompt: this.context.intl.formatMessage(this.messages.noMatchReenterPassword_error)
                    }]
                },
                recaptcha: {
                    identifier: 'recaptcha',
                    rules: [{
                        type: 'recaptcha',
                        prompt: this.context.intl.formatMessage(this.messages.recaptcha_prompt)
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
                title: this.context.intl.formatMessage(this.messages.swal_title),
                text: this.context.intl.formatMessage(this.messages.swal_text),
                type: 'question',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: this.context.intl.formatMessage(this.messages.swal_confirmButton),
                confirmButtonClass: 'positive ui button',
                cancelButtonText: this.context.intl.formatMessage(this.messages.swal_cancelButton),
                cancelButtonClass: 'ui red button',
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
                title: this.context.intl.formatMessage(this.messages.swal_title),
                text: this.context.intl.formatMessage(this.messages.swal2_text),
                type: 'error',
                showCloseButton: true,
                showCancelButton: false,
                confirmButtonText: this.context.intl.formatMessage(this.messages.swal2_confirmButton),
                confirmButtonClass: 'ui button',
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
                title: this.context.intl.formatMessage(this.messages.swal3_title),
                text: this.context.intl.formatMessage(this.messages.swal3_text),
                type: 'success',
                confirmButtonText: this.context.intl.formatMessage(this.messages.swal3_confirmButton),
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
                title: this.context.intl.formatMessage(this.messages.swal4_title),
                text: this.props.UserRegistrationStore.errorMessage, //it should be translated in the place it is generated
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(this.messages.swal3_confirmButton),
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

        let language = common.getIntlLanguage();

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
        let url = Microservices.user.uri + '/connect/' + provider;

        let width = screen.width*0.75, height = screen.height*0.75;
        if (width < 600)
            width = screen.width;
        if (height < 500)
            height = screen.height;
        let left = screen.width/2-width/2, topSpace = screen.height/2-height/2;

        let win = window.open(url, '_blank', 'width='+width+',height='+height+',left='+left+',top='+topSpace+',toolbar=No,location=No,scrollbars=no,status=No,resizable=no,fullscreen=No');
        win.focus();
    }

    doSSO(e) {
        e.preventDefault();

        this.context.executeAction(openSSOModal, {register: true});
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
            return false;
        }
        finally {
            //delete data
            localStorage.setItem(NAME, '');
        }

        //add language before send to service
        let language = common.getIntlLanguage();
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
                title: this.context.intl.formatMessage(this.messages.swal5_title),
                text: this.context.intl.formatMessage(this.messages.swal5_text)+provider+this.context.intl.formatMessage(this.messages.swal5_text2),
                confirmButtonText: this.context.intl.formatMessage(this.messages.swal5_confirmButton),
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
            'required': true,
            'error': (emailNotAllowed !== undefined) ? emailNotAllowed : false
        });
        let emailIconClasses = classNames({
            'icon': true,
            'inverted circular red remove': (emailNotAllowed !== undefined) ? emailNotAllowed : false,
            'inverted circular green checkmark': (emailNotAllowed !== undefined) ? !emailNotAllowed : false
        });
        let emailToolTipp = emailNotAllowed ? 'This E-Mail has already been registered by someone else. Please use another one.' : undefined;

        const usernameNotAllowed = this.props.UserRegistrationStore.failures.usernameNotAllowed;
        let usernameClasses = classNames({
            'ui': true,
            'field': true,
            'inline': true,
            'required': true,
            'error': (usernameNotAllowed !== undefined) ? usernameNotAllowed : false
        });
        let usernameIconClasses = classNames({
            'icon': true,
            'inverted circular red remove': (usernameNotAllowed !== undefined) ? usernameNotAllowed : false,
            'inverted circular green checkmark': (usernameNotAllowed !== undefined) ? !usernameNotAllowed : false
        });
        let usernameToolTipp = usernameNotAllowed ? 'This Username has already been registered by someone else. Please choose another one.' : undefined;
        if (this.props.UserRegistrationStore.suggestedUsernames.length > 0) {
            usernameToolTipp += '\n Here are some suggestions: ' + this.props.UserRegistrationStore.suggestedUsernames;
        }

        let content = <div className="ui blue padded center aligned segment">
            <h2 className="ui dividing header">{this.context.intl.formatMessage(this.messages.modal_title)}</h2>
            <h3 className="ui dividing header">{this.context.intl.formatMessage(this.messages.modal_subtitle)}</h3>

            {/*<button className="ui basic icon large circular button" onClick={this.socialRegister.bind(this, 'facebook')} aria-label="Sign up with Facebook"><i className="big facebook square icon"> </i></button>*/}
            {ssoEnabled ? <button className="ui basic icon large circular button" onClick={this.doSSO.bind(this)} title='Sign up with an account of another SlideWiki instance' aria-label="Sign up with another SlideWiki instance"><i className="big user icon"></i></button> : ''}
            <button className="ui basic icon large circular button" onClick={this.socialRegister.bind(this, 'google')} aria-label={this.context.intl.formatMessage(this.messages.modal_googleButton)}><i className="big google plus lnk icon"></i></button>
            <button className="ui basic icon large circular button" onClick={this.socialRegister.bind(this, 'github')} aria-label={this.context.intl.formatMessage(this.messages.modal_githubButton)}><i className="big github icon"></i></button>

            <p>{this.context.intl.formatMessage(this.messages.modal_termText1)} <a href="/imprint" title={this.context.intl.formatMessage(this.messages.modal_termLinkTitle)}>{this.context.intl.formatMessage(this.messages.modal_termText2)}</a>.</p>
            <div className="ui dividing header" ></div>

            <h3 className="ui dividing header">{this.context.intl.formatMessage(this.messages.modal_subtitle2)}</h3>
            <form className="ui form" ref="UserRegistration_form" >
                <div className="ui inline required field">
                    <label style={signUpLabelStyle} htmlFor="FirstName_label">{this.context.intl.formatMessage(this.messages.form_firstName)}</label>
                    <div className="ui icon input"><input type="text" id="FirstName_label" name="firstname" ref="firstname" placeholder={this.context.intl.formatMessage(this.messages.form_firstName)} autoFocus aria-required="true"/></div>
                </div>
                <div className="ui inline required field">
                    <label style={signUpLabelStyle} htmlFor="LastName_label">{this.context.intl.formatMessage(this.messages.form_lastName)}</label>
                    <div className="ui icon input"><input type="text" id="LastName_label" name="lastname" ref="lastname" aria-required="true" placeholder={this.context.intl.formatMessage(this.messages.form_lastName)} /></div>
                </div>
                <div className={usernameClasses} data-tooltip={usernameToolTipp} data-position="top center" data-inverted="" onBlur={this.checkUsername.bind(this)}>
                    <label style={signUpLabelStyle} htmlFor="username_label">{this.context.intl.formatMessage(this.messages.form_userName)}</label>
                    <div className="ui icon input"><i className={usernameIconClasses}/><input type="text" id="username_label" name="username" ref="username" placeholder={this.context.intl.formatMessage(this.messages.form_userName)} aria-required="true"/></div>
                </div>
                <div className={emailClasses} data-tooltip={emailToolTipp} data-position="top center" data-inverted="" onBlur={this.checkEmail.bind(this)}>
                    <label style={signUpLabelStyle} htmlFor="email_label">{this.context.intl.formatMessage(this.messages.form_email)}</label>
                    <div className="ui icon input"><i className={emailIconClasses}/><input type="text" id="email_label" name="email" ref="email" placeholder={this.context.intl.formatMessage(this.messages.form_email)} aria-required="true"/></div>
                </div>
                <div className="ui inline required field">
                    <label style={signUpLabelStyle} htmlFor="reenteremail">{this.context.intl.formatMessage(this.messages.form_reenterEmail)}</label>
                    <div className="ui icon input"><input type="text" id="reenteremail" name="reenteremail" ref="reenteremail" placeholder={this.context.intl.formatMessage(this.messages.form_reenterEmail)} aria-required="true"/></div>
                </div>
                <div className="ui inline required field">
                    <label style={signUpLabelStyle} htmlFor="password_label">{this.context.intl.formatMessage(this.messages.form_password)}</label>
                    <div className="ui icon input"><input type="password" id="password_label" name="password" ref="password" placeholder={this.context.intl.formatMessage(this.messages.form_password)} aria-required="true"/></div>
                </div>
                <div className="ui inline field">
                    <label style={signUpLabelStyle} htmlFor="reenterpassword_label">{this.context.intl.formatMessage(this.messages.form_reenterPassword)}</label>
                    <div className="ui icon input"><input type="password" id="reenterpassword_label" name="reenterpassword" ref="reenterpassword" placeholder={this.context.intl.formatMessage(this.messages.form_reenterPassword)} aria-required="true"/></div>
                </div>
                <div >
                    <input type="hidden" id="recaptcha" name="recaptcha"></input>
                    <ReCAPTCHA style={recaptchaStyle} ref="recaptcha" sitekey={publicRecaptchaKey} onChange={this.onRecaptchaChange.bind(this)} aria-required="true"/>
                </div>
                <div className="ui error message" ></div>
                <br/>
                <button type="submit" className="ui blue labeled submit icon button" >
                    <i className="icon add user"/> {this.context.intl.formatMessage(this.messages.form_submitButton)}
                </button>
            </form>
            <div className="ui dividing header" ></div>
          {this.context.intl.formatMessage(this.messages.form_terms)}<a href="/imprint">{this.context.intl.formatMessage(this.messages.form_terms2)}</a>.
            <br/><br/>
            <a href="#" onClick={this.handleNoAccessClick}>{this.context.intl.formatMessage(this.messages.form_noAccess)}</a>
        </div>;
        return (
            <div>
                <div className="ui vertically padded centered grid container" >
                    <MediaQuery minDeviceWidth={768}>
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

                <UserRegistrationSocial ref="modal_social"/>

            </div>
        );
    }
}

UserRegistration.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};
UserRegistration = connectToStores(UserRegistration, [UserRegistrationStore], (context, props) => {
    return {
        UserRegistrationStore: context.getStore(UserRegistrationStore).getState()
    };
});
export default UserRegistration;
