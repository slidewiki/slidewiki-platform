import React from 'react';
import ReactDom from 'react-dom';
import userSignIn from '../../../actions/user/userSignIn';
import userSignUp from '../../../actions/user/userSignUp';
import resetUserRegistration from '../../../actions/user/resetUserRegistration';
import { Microservices } from '../../../configs/microservices';
import {connectToStores} from 'fluxible-addons-react';
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
                email2: {
                    identifier: 'email2',
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
                        type: 'match[email2]',
                        prompt: 'Your emails do not match'
                    }]
                },
                password2: {
                    identifier: 'password2',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter a password'
                    }, {
                        type: 'minLength[6]',
                        prompt: 'Your password must be at least {ruleValue} characters long'
                    }]
                },
                reenterpassword2: {
                    identifier: 'reenterpassword2',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter your password again'
                    }, {
                        type: 'match[password2]',
                        prompt: 'Your passwords do not match'
                    }]
                }
            },
            onSuccess: this.handleSignUp.bind(this)
        };
        const signinValidation = {
            fields: {
                email1: {
                    identifier: 'email1',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter your email address'
                    }, {
                        type: 'email',
                        prompt: 'Please enter a valid email address'
                    }]
                },
                password1: {
                    identifier: 'password1',
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
        if (this.props.UserRegistrationStore.userType === 'pending') {
            $('.dimmer')
                .dimmer('toggle');
            this.context.executeAction(resetUserRegistration, {
            });
        }
    }

    handleSignIn() {
        $('#email1').val('');
        $('#password1').val('');

        this.context.executeAction(userSignIn, {
            email: this.refs.email1.value,
            password: this.refs.password1.value
        });
    }

    handleSignUp() {
        let language = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
        let username = $('#firstname').val().charAt(0).toLowerCase() + $('#lastname').val().toLowerCase();

        $('#firstname').val('');
        $('#lastname').val('');
        $('#email2').val('');
        $('#reenteremail').val('');
        $('#password2').val('');
        $('#reenterpassword2').val('');

        this.context.executeAction(userSignUp, {
            firstname: this.refs.firstname.value,
            lastname: this.refs.lastname.value,
            username: username,
            language: language,
            email: this.refs.email2.value,
            password: this.refs.password2.value
        });

    }

    render() {
        return (
          <div className="ui page centered grid" >
              <div className="ui page dimmer">
                  <div className="content">
                      <div className="center">
                          <h2 className="ui inverted icon header">
                              <i className="icon circular inverted green mail outline"></i>
                              Thanks for signing up!
                          </h2>
                          <br/>
                          To complete the registration process you have to confirm your account. An email has been sent to your address.
                          <br/>
                          To confirm and activate your account please check your inbox and click on the link inside the email we just sent you.
                      </div>
                  </div>
              </div>
              <div className="ui three column row">
                  <div className="seven wide column">
                      <div className="ui blue padded center aligned segment">
                          <h2 className="ui dividing header">Sign In</h2>
                          <form className="ui form signin">
                              <div className="ui icon input field">
                                  <input type="email" id="email1" name="email1" ref="email1" placeholder="Email" autoFocus/><i className="mail icon"></i>
                              </div><br/>
                              <div className="ui icon input field">
                                  <input type="password" id="password1" name="password1" ref="password1" placeholder="Password"/><i className="lock icon"></i>
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
                          <div className="ui input field">
                              <input type="text" id="firstname" name="firstname" ref="firstname" placeholder="First name"/>
                          </div><br/>
                          <div className="ui input field">
                              <input type="text" id="lastname" name="lastname" ref="lastname" placeholder="Last name"/>
                          </div><br/>
                          <div className="ui input field">
                              <input type="email" id="email2" name="email2" ref="email2" placeholder="Email"/>
                          </div><br/>
                          <div className="ui input field">
                              <input type="email" id="reenteremail" name="reenteremail" ref="reenteremail" placeholder="Re-enter email"/>
                          </div><br/>
                          <div className="ui input field">
                              <input type="password" id="password2" name="password2" ref="password2" placeholder="Password"/>
                          </div><br/>
                          <div className="ui input field">
                              <input type="password" id="reenterpassword2" name="reenterpassword2" ref="reenterpassword2" placeholder="Re-enter Password"/>
                          </div><br/>
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
