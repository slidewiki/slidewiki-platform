import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import checkEmail from '../../actions/user/registration/checkEmail';
import checkUsername from '../../actions/user/registration/checkUsername';
import UserRegistrationStore from '../../stores/UserRegistrationStore';
import common from '../../common';
import finalizeMergedUser from '../../actions/user/finalizeMergedUser';
import instances from '../../configs/instances.js';

const headerStyle = {
    'textAlign': 'center'
};
const modalStyle = {
    top: '15%'
};

class ReviseUser extends React.Component {
    constructor(props) {
        super(props);

        this.setUserdata = this.setUserdata.bind(this);
        this.handleNoAccessClick = this.handleNoAccessClick.bind(this);
    }

    componentDidMount() {
        //Form validation
        const validationRules = {
            fields: {

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
                        type   : 'regExp[/^[a-zA-Z0-9-.~_]+$/i]',
                        prompt : 'The username must contain only alphanumeric characters plus the following: _ . - ~'
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

        $(ReactDOM.findDOMNode(this.refs.ReviseUser_form)).form(validationRules);

    }

    componentWillReceiveProps(nextProps) {
        // console.log('UserRegistrationSocial componentWillReceiveProps()', this.props.UserRegistrationStore.socialuserdata, nextProps.UserRegistrationStore.socialuserdata);
        if (nextProps.UserRegistrationStore.socialuserdata.email === undefined && nextProps.UserRegistrationStore.socialuserdata.username === undefined) {
            this.setUserdata({}, false);
            return;
        }
        if (nextProps.UserRegistrationStore.socialuserdata && localStorage.getItem(MODI) === 'register') {
            if ((nextProps.UserRegistrationStore.socialuserdata.username && !(this.refs.username.value)) || (nextProps.UserRegistrationStore.socialuserdata.email && !(this.refs.email.value)))
                this.setUserdata(nextProps.UserRegistrationStore.socialuserdata);
        }
    }

    handleSignUp(e) {
        e.preventDefault();

        $(ReactDOM.findDOMNode(this.refs.SocialRegistration_Modal)).modal('hide');
        let user = this.props.UserRegistrationStore.socialuserdata;
        user.email = this.refs.email.value;
        user.username = this.refs.username.value;
        user.hash = this.props.hash;

        let language = common.getIntlLanguage();
        user.language = language;

        user.url = instances[instances._self].finalize.replace('{hash}', this.props.hash);

        this.context.executeAction(finalizeMergedUser, user);

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

    setUserdata(data, check = true) {
        // console.log('ReviseUser setUserdata()', data);

        this.refs.username.value = data.username || '';
        this.refs.email.value = data.email || '';

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

    render() {
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
            <div className="ui ssoregistration modal" id='signinModal' style={modalStyle} ref="ReviseUser_Modal" >
              <div className="header">
                  <h1 style={headerStyle}>Validate user information</h1>
                  <h2 style={headerStyle}>Your account could not migrated automatically. In order to finialize the migration, please change the data which is already in use.</h2>
                  <h3 style={headerStyle}>Hint: if your email or username is already in use, it could be possible that you have already an stand-alone account on this SlideWiki instance. In this case close the window and do a sign in.</h3>
              </div>
              <div className="content">
                  <form className="ui ssoregistrationmodalform form" ref="ReviseUser_form" >
                      <div className={usernameClasses} data-tooltip={usernameToolTipp} data-position="top center" data-inverted="" onBlur={this.checkUsername.bind(this)}>
                          <label style={signUpLabelStyle}>Username * </label>
                          <div className="ui icon input"><i className={usernameIconClasses}/><input type="text" name="username" ref="username" placeholder="Username" aria-required="true" value={this.props.username} /></div>
                      </div>
                      <div className={emailClasses} data-tooltip={emailToolTipp} data-position="top center" data-inverted="" onBlur={this.checkEmail.bind(this)}>
                          <label style={signUpLabelStyle}>Email * </label>
                          <div className="ui icon input"><i className={emailIconClasses}/><input type="email" name="email" ref="email" placeholder="Email" aria-required="true" value={this.props.email} /></div>
                      </div>
                      <div className="ui error message"></div>
                      <button type="submit" className="ui blue labeled submit icon button" >
                          <i className="icon add user"/> Migrate User
                      </button>
                  </form>
              </div>
              <div className="actions">
                  <div className="ui cancel button">Cancel</div>
              </div>
            </div>
          </div>
        );
    }
}

ReviseUser.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ReviseUser = connectToStores(ReviseUser, [UserRegistrationStore], (context, props) => {
    return {
        UserRegistrationStore: context.getStore(UserRegistrationStore).getState()
    };
});
export default ReviseUser;
