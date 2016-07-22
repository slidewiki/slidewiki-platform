import React from 'react';
import ReactDom from 'react-dom';
import {connectToStores} from 'fluxible-addons-react';
import { Microservices } from '../../../configs/microservices';
import userSignIn from '../../../actions/user/userSignIn';
import userSignUp from '../../../actions/user/userSignUp';
import resetUserRegistrationStatus from '../../../actions/user/resetUserRegistrationStatus';
import UserRegistrationStore from '../../../stores/UserRegistrationStore';

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
                        type: 'minLength[6]',
                        prompt: 'Your password must be at least {ruleValue} characters long'
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
                }
            },
            onSuccess: this.handleSignUp.bind(this)
        };
        const signinValidation = {
            fields: {
                emailsignin: {
                    identifier: 'emailsignin',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter your email address'
                    }, {
                        type: 'email',
                        prompt: 'Please enter a valid email address'
                    }]
                },
                passwordsignin: {
                    identifier: 'passwordsignin',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter a password'
                    }, {
                        type: 'minLength[6]',
                        prompt: 'Your password must be at least {ruleValue} characters long'
                    }]
                }
            },
            onSuccess: this.handleSignIn.bind(this)
        };

        $('.ui.form.signup').form(signupValidation);
        $('.ui.form.signin').form(signinValidation);
        // stop the forms from submitting normally
        $('.ui.form.signin').submit((e) => {
            e.preventDefault(); //usually use this, but below works best here.
            return false;
        });
        $('.ui.form.signup').submit((e) => {
            e.preventDefault(); //usually use this, but below works best here.
            return false;
        });

        $('#github').on('click',(e) => {
            e.preventDefault();
            let win = window.open('' + Microservices.auth.uri + '/connect/github','_blank','width=1100,height=800,toolbar=0,status=0,');
            let content;
            win.onclose = () => {
                console.log('Blabla');
                console.log(win.document);
            };
        });
        $('#google').on('click',(e) => {
            e.preventDefault();
            let win = window.open('' + Microservices.auth.uri + '/connect/google','_blank','toolbar=0,status=0,');
        });
    }

    componentDidUpdate() {
        if (this.props.UserRegistrationStore.registrationStatus === 'pending') {
            $('.dimmer.success')
                .dimmer('toggle');
            this.context.executeAction(resetUserRegistrationStatus, {
            });

            //Clear input if successful registration
            this.refs.firstname.value = '';
            this.refs.lastname.value = '';
            this.refs.username.value = '';
            this.refs.emailsignup.value = '';
            this.refs.reenteremail.value = '';
            this.refs.passwordsignup.value = '';
            this.refs.reenterpasswordsignup.value = '';
        } else if (this.props.UserRegistrationStore.registrationStatus === 'error') {
            $('.dimmer.error')
                .dimmer('toggle');
            this.context.executeAction(resetUserRegistrationStatus, {
            });
        }
    }

    handleSignIn() {
        this.refs.emailsignin.value = '';
        this.refs.passwordsignin.value = '';

        this.context.executeAction(userSignIn, {
            email: this.refs.emailsignin.value,
            password: this.refs.passwordsignin.value
        });
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
            password: this.refs.passwordsignup.value
        });
    }

    render() {
        //TODO email confirmation
        // const successMessage1 = 'To complete the registration process you have to confirm your account. An email has been sent to your address.';
        // const successMessage2 = 'To confirm and activate your account please check your inbox and click on the link inside the email we just sent you.';
        const successMessage1 = 'Thank you.';
        const successMessage2 = 'You have successfully registered.';

        let dimmerMessageSuccess = (//pending message
            <div className="ui page dimmer success">
                <div className="content">
                    <div className="center">
                        <h2 className="ui inverted icon header">
                            <i className="icon circular inverted green mail outline"></i>
                            Thanks for signing up!
                        </h2>
                        <br/>
                        {successMessage1}
                        <br/>
                        {successMessage2}
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
                  </div>
              </div>
          </div>
        );

        const signUpLabelStyle = {width: '150px'};
        return (
            <div className="ui page centered grid" >
                {dimmerMessageSuccess}
                {dimmerMessageError}
                <div className="ui three column row">
                    <div className="seven wide column">
                        <div className="ui blue padded center aligned segment">
                            <h2 className="ui dividing header">Sign In</h2>
                            <form className="ui form signin">
                                <div className="ui icon input field">
                                    <input type="email" id="emailsignin" name="emailsignin" ref="emailsignin" placeholder="Email" autoFocus/><i className="mail icon"></i>
                                </div><br/>
                                <div className="ui icon input field">
                                    <input type="password" id="passwordsignin" name="passwordsignin" ref="passwordsignin" placeholder="Password"/><i className="lock icon"></i>
                                </div><br/>
                                <div className="ui error message"></div>
                                <button type="submit" className="ui blue labeled submit icon button">
                                    <i className="icon sign in"></i> Sign In
                                </button>
                            </form>
                            <br/>
                            <div className="ui floated right ">
                                <a href="">I can not access my account</a>
                            </div>
                        </div>
                    </div>
                    <div className="two wide column">
                        <div className="ui vertical section divider"> Or </div>
                    </div>
                    <div className="seven wide column">
                        <div className="ui blue padded center aligned segment">
                            <h2 className="ui dividing header">Social Login</h2>
                            <div className="ui two column grid">
                            <div className="wide column">
                              <button id='google' className="ui blue labeled icon button">
                                  <i className="large icon google"></i> Sign in with Google
                              </button>
                            </div>
                            <div className="wide column">
                            <button id='github' className="ui dark grey labeled icon button">
                                <i className="large icon github"></i> Sign in with Github
                            </button>
                            </div>
                            </div>
                            <br/>
                            <div className="ui floated right ">
                                <a href="">I can not access my account</a>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div className="ui horizontal section divider"> Or </div>
                <div className="eight wide column">
                    <div className="ui green padded center aligned segment">
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
                            <div className="ui error message"></div>
                            <button type="submit" className="ui green labeled submit icon button" >
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
