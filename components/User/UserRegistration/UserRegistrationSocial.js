import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import socialSignUp from '../../../actions/user/registration/socialSignUp';
import checkEmail from '../../../actions/user/registration/checkEmail';
import checkUsername from '../../../actions/user/registration/checkUsername';
import UserRegistrationStore from '../../../stores/UserRegistrationStore';
import { FormattedMessage, defineMessages } from 'react-intl';
import common from '../../../common';

const headerStyle = {
    'textAlign': 'center'
};
const modalStyle = {
    top: '15%'
};
const MODI = 'sociallogin_modi';
const NAME = 'sociallogin_data';

class UserRegistrationSocial extends React.Component {
    constructor(props) {
        super(props);
        this.provider = '';

        this.setUserdata = this.setUserdata.bind(this);
        this.handleNoAccessClick = this.handleNoAccessClick.bind(this);
    }

    componentDidMount() {
        const messages = defineMessages({
            firstnameprompt: {
                id: 'UserRegistrationSocial.firstnameprompt',
                defaultMessage: 'Please enter your first name',
            },
            lastnameprompt: {
                id: 'UserRegistrationSocial.lastnameprompt',
                defaultMessage: 'Please enter your last name',
            },
            usernameprompt: {
                id: 'UserRegistrationSocial.usernameprompt',
                defaultMessage: 'Please select your username',
            },
            usernameprompt2: {
                id: 'UserRegistrationSocial.usernameprompt2',
                defaultMessage: 'The username is already in use',
            },
            usernameprompt3: {
                id: 'UserRegistrationSocial.usernameprompt3',
                defaultMessage: 'Your username can not be longer than 64 characters',
            },
            usernameprompt4: {
                id: 'UserRegistrationSocial.usernameprompt4',
                defaultMessage: 'The username must contain only alphanumeric characters plus the following: _ . - ~',
            },
            mailprompt: {
                id: 'UserRegistrationSocial.mailprompt',
                defaultMessage: 'Please enter your email address',
            },
            mailprompt2: {
                id: 'UserRegistrationSocial.mailprompt2',
                defaultMessage: 'Please enter a valid email address',
            },
            mailprompt3: {
                id: 'UserRegistrationSocial.mailprompt3',
                defaultMessage: 'The email address is already in use',
            },
        });
        //Form validation
        const validationRules = {
            fields: {
                firstname: {
                    identifier: 'firstname',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(messages.firstnameprompt)
                    }]
                },
                lastname: {
                    identifier: 'lastname',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(messages.lastnameprompt)
                    }]
                },
                username: {
                    identifier: 'username',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(messages.usernameprompt)
                    }, {
                        type: 'uniqueUsername',
                        prompt: this.context.intl.formatMessage(messages.usernameprompt2)
                    }, {
                        type   : 'maxLength[64]',
                        prompt : this.context.intl.formatMessage(messages.usernameprompt3)
                    }, {
                        type   : 'regExp[/^[a-zA-Z0-9-.~_]+$/i]',
                        prompt : this.context.intl.formatMessage(messages.usernameprompt4)
                    }]
                },
                email: {
                    identifier: 'email',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(messages.mailprompt)
                    }, {
                        type: 'email',
                        prompt: this.context.intl.formatMessage(messages.mailprompt2)
                    }, {
                        type: 'uniqueEmail',
                        prompt: this.context.intl.formatMessage(messages.mailprompt3)
                    }]
                }
            },
            onSuccess: this.handleSignUp.bind(this)
        };

        $.fn.form.settings.rules.uniqueEmail = (() => {
            const emailNotAllowed = this.props.UserRegistrationStore.failures.emailNotAllowed;
            return (emailNotAllowed !== undefined) ? !emailNotAllowed : true;
        });
        $.fn.form.settings.rules.uniqueUsername = (() => {
            const usernameNotAllowed = this.props.UserRegistrationStore.failures.usernameNotAllowed;
            return (usernameNotAllowed !== undefined) ? !usernameNotAllowed : true;
        });

        $(ReactDOM.findDOMNode(this.refs.UserSocialRegistration_form)).form(validationRules);

    }

    componentWillReceiveProps(nextProps) {
        // console.log('UserRegistrationSocial componentWillReceiveProps()', this.props.UserRegistrationStore.socialuserdata, nextProps.UserRegistrationStore.socialuserdata);
        if (nextProps.UserRegistrationStore.socialuserdata && localStorage.getItem(MODI) === 'register') {
            if ((nextProps.UserRegistrationStore.socialuserdata.username && !(this.refs.username.value)) && (nextProps.UserRegistrationStore.socialuserdata.email && !(this.refs.email.value)))
                this.setUserdata(nextProps.UserRegistrationStore.socialuserdata);
        } else if (nextProps.UserRegistrationStore.socialError && !this.props.UserRegistrationStore.socialError) {
            const messages = defineMessages({
                genericError: {
                    id: 'UserRegistrationSocial.genericError',
                    defaultMessage: 'An error occured. Please try again later.',
                },
                error: {
                    id: 'UserRegistrationSocial.error',
                    defaultMessage: 'Social Login Error',
                },
                confirm: {
                    id: 'UserRegistrationSocial.confirm',
                    defaultMessage: 'OK',
                }
            });

            swal({
                titleText: this.context.intl.formatMessage(messages.error),
                text: this.context.intl.formatMessage(messages.genericError),
                type: 'error',
                showCancelButton: false,
                confirmButtonText: this.context.intl.formatMessage(messages.confirm),
                confirmButtonClass: 'ui button',
                buttonsStyling: false
            });
        }
    }

    handleSignUp(e) {
        e.preventDefault();

        $(ReactDOM.findDOMNode(this.refs.SocialRegistration_Modal)).modal('hide');
        let user = this.props.UserRegistrationStore.socialuserdata;
        user.email = this.refs.email.value + '';
        user.username = this.refs.username.value + '';
        user.forename = this.refs.firstname.value + '';
        user.surname = this.refs.lastname.value + '';

        let language = common.getIntlLanguage();
        user.language = language;

        this.context.executeAction(socialSignUp, user);

        this.refs.username.value = '';
        this.refs.email.value = '';
        this.refs.lastname.value = '';
        this.refs.firstname.value = '';

        return false;
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

    getProviderName() {
        if (this.provider.length < 1)
            return '';
        return this.provider.charAt(0).toUpperCase() + this.provider.slice(1);
    }

    setUserdata(data, check = true) {
        // console.log('UserRegistrationSocial setUserdata()', data);

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

    handleNoAccessClick(e) {
        e.preventDefault();
        $(ReactDOM.findDOMNode(this.refs.SocialRegistration_Modal)).modal('hide');
        this.context.executeAction(navigateAction, {
            url: '/resetpassword'
        });
    }

    handleCancelClick(e) {
        e.preventDefault();

        this.refs.username.value = '';
        this.refs.email.value = '';
        this.refs.lastname.value = '';
        this.refs.firstname.value = '';
    }

    render() {
        const messages = defineMessages({
            emailNotAllowed: {
                id: 'UserRegistrationSocial.emailNotAllowed',
                defaultMessage: 'This E-Mail has already been used by someone else. Please choose another one.',
            },
            usernameNotAllowed: {
                id: 'UserRegistrationSocial.usernameNotAllowed',
                defaultMessage: 'This Username has already been used by someone else. Please choose another one.',
            },
            usernameSuggest:{
                id: 'UserRegistrationSocial.usernamesuggestion',
                defaultMessage: 'Here are some suggestions:'
            }
        });
        const signUpLabelStyle = {width: '150px'};

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
        let emailToolTipp = emailNotAllowed ? this.context.intl.formatMessage(messages.emailNotAllowed) : undefined;

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
        let usernameToolTipp = usernameNotAllowed ? this.context.intl.formatMessage(messages.usernameNotAllowed) : undefined;
        if (this.props.UserRegistrationStore.suggestedUsernames.length > 0) {
            usernameToolTipp += '\n' + this.context.intl.formatMessage(messages.usernameSuggest) + this.props.UserRegistrationStore.suggestedUsernames;
        }
        return (
          <div>
            <div className="ui socialregistration modal" id='socialregistrationModal' style={modalStyle} ref="SocialRegistration_Modal"
              role='dialog'
              aria-labelledby='socialsignupsmodal_header'
			        aria-describedby='socialsignupsmodal_content'
              tabIndex="0" >
              <div className="header" id="socialsignupsmodal_header">
                  <h1 style={headerStyle}>
                    <FormattedMessage
                      id='UserRegistrationSocial.validate'
                      defaultMessage='Validate user information'
                    />
                  </h1>
              </div>
              <div className="content" id="socialsignupsmodal_content">
                  <form className="ui registrationmodalform form" ref="UserSocialRegistration_form" >
                      <div className="ui inline field">
                          <label style={signUpLabelStyle}>
                            <FormattedMessage
                              id='UserRegistrationSocial.fname'
                              defaultMessage='First name * '
                            />
                          </label>
                          <div className="ui icon input"><input type="text" name="firstname" ref="firstname" placeholder="First name" autoFocus aria-required="true"/></div>
                      </div>
                      <div className="ui inline field">
                          <label style={signUpLabelStyle}>
                            <FormattedMessage
                              id='UserRegistrationSocial.lname'
                              defaultMessage='Last name * '
                            />
                          </label>
                          <div className="ui icon input"><input type="text" name="lastname" ref="lastname" placeholder="Last name" aria-required="true"/></div>
                      </div>
                      <div className={usernameClasses} data-tooltip={usernameToolTipp} data-position="top center" data-inverted="" onBlur={this.checkUsername.bind(this)}>
                          <label style={signUpLabelStyle}>
                            <FormattedMessage
                              id='UserRegistrationSocial.uname'
                              defaultMessage='Username * '
                            />
                          </label>
                          <div className="ui icon input"><i className={usernameIconClasses}/><input type="text" name="username" ref="username" placeholder="Username" aria-required="true"/></div>
                      </div>
                      <div className={emailClasses} data-tooltip={emailToolTipp} data-position="top center" data-inverted="" onBlur={this.checkEmail.bind(this)}>
                          <label style={signUpLabelStyle}>
                            <FormattedMessage
                              id='UserRegistrationSocial.email'
                              defaultMessage='Email * '
                            />
                          </label>
                          <div className="ui icon input"><i className={emailIconClasses}/><input type="email" name="email" ref="email" placeholder="Email" aria-required="true"/></div>
                      </div>
                      <div className="ui error message" role="region" aria-live="polite"/>
                      <button type="submit" className="ui blue labeled submit icon button" role="button" tabIndex="0" >
                          <i className="icon add user"/>
                          <FormattedMessage
                            id='UserRegistrationSocial.signup'
                            defaultMessage=' Sign Up'
                          />
                      </button>
                  </form>
                  <div className="ui dividing header" ></div>
                  <a href="#" onClick={this.handleNoAccessClick}>
                    <FormattedMessage
                      id='UserRegistrationSocial.account'
                      defaultMessage='I can not access my account'
                    />
                  </a>
              </div>
              <div className="actions">
                  <button type="button" className="ui cancel button" onClick={this.handleCancelClick.bind(this)} role="button" tabIndex="0">
                    <FormattedMessage
                      id='UserRegistrationSocial.cancel'
                      defaultMessage='Cancel'
                    />
                  </button>
              </div>
            </div>
          </div>
        );
    }
}

UserRegistrationSocial.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};
UserRegistrationSocial = connectToStores(UserRegistrationSocial, [UserRegistrationStore], (context, props) => {
    return {
        UserRegistrationStore: context.getStore(UserRegistrationStore).getState()
    };
});
export default UserRegistrationSocial;
