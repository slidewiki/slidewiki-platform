import React from 'react';
import async from 'async';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import userSignIn from '../../actions/user/userSignIn';
import userSignOut from '../../actions/user/userSignOut';
import userSocialSignIn from '../../actions/user/userSocialSignIn';
import newSocialData from '../../actions/user/registration/newSocialData';
import HeaderDropdown from './HeaderDropdown.js';
import ReactDOM from 'react-dom';
import {hashPassword} from '../../configs/general';
import common from '../../common';
import {Microservices} from '../../configs/microservices';
let classNames = require('classnames');
let MediaQuery = require ('react-responsive');

const headerStyle = {
    'textAlign': 'center'
};
const modalStyle = {
    top: '15%'
};
const MODI = 'sociallogin_modi';
const NAME = 'sociallogin_data';

class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.handleSignupClick = this.handleSignupClick.bind(this);
        this.handleNoAccessClick = this.handleNoAccessClick.bind(this);
        this.signin = this.signin.bind(this);
        this.provider = '';
        this.isLoading = false;
    }

    isModalShown() {
        const classes = $('.ui.login.modal').attr('class');
        return classes.indexOf('hidden') === -1;
    }

    handleLoginButton() {
        $('.ui.login.modal').modal('toggle');
        setTimeout(() => {
            ReactDOM.findDOMNode(this.refs.email1).focus();
        }, 0);
    }

    signin(e) {
        e.preventDefault();
        const email = this.refs.email1.value;
        let regExp = /\S+@\S+\.\S+/;
        if (email === '' || !regExp.test(email)) {//Check if email is valid
            $('.ui.form.signin').form('add errors', ['Please use a valid email address']);
        } else {
            this.context.executeAction(userSignIn, {
                email: this.refs.email1.value,
                password: hashPassword(this.refs.password1.value)
            });

            this.isLoading = true;
            this.forceUpdate();
        }
        return false;
    }

    handleRegisterFirst(dismiss) {
        localStorage.setItem(MODI, 'login_failed_register_now');

        let thatContext = this.context;
        async.series([
            function(callback) {
                thatContext.executeAction(navigateAction, {
                    url: '/signup'
                });
                callback(null, 'two');
            }
        ]);

        return true;
    }

    componentDidUpdate() {
        console.log('componentDidUpdate:', this.props.errorMessage, this.props.socialLoginError, this.props.userid, this.props.username);
        if (this.props.errorMessage !== '' && this.props.errorMessage !== undefined && this.isLoading) {
            $('.ui.form.signin').form('add errors', [this.props.errorMessage]);
            this.isLoading = false;
            this.forceUpdate();
        }
        else if (localStorage.getItem(MODI) === 'login' && this.props.socialLoginError){
            this.isLoading = false;
            this.forceUpdate();
            swal({
                title: 'Information',
                text: 'You haven\'t logged in before with these credentials. Either choose another provider to log in or try to register a new account.',
                type: 'question',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Register now',
                confirmButtonClass: 'positive ui button',
                cancelButtonText: 'Try another provider',
                cancelButtonClass: 'ui orange button',
                buttonsStyling: false
            })
            .then((dismiss) => {
                // console.log('action after dismiss', dismiss);
                $('.ui.login.modal').modal('hide');
                return this.handleRegisterFirst(dismiss);
            })
            .catch((action) => {
                // console.log('action after click', action);
                localStorage.setItem(MODI, 'login_failed');

                //delete old data
                let that = this;
                async.series([
                    function(callback) {
                        that.context.executeAction(newSocialData, {});
                        callback(null, 'one');
                    }
                ],
                // optional callback
                (err, results) => {
                    if (action !== 'close')
                        that.handleLoginButton();
                });

                return true;
            });
        }
        else if (this.props.userid !== '') {
            localStorage.setItem(MODI, 'login_success');
            this.isLoading = false;
            $('.ui.login.modal').modal('hide');

            //redirect if on a specific page
            if (location.pathname === '/signup' || location.pathname === '/resetpassword') {
                this.context.executeAction(navigateAction, {
                    url: '/user/' + this.props.username + '/settings/profile'
                });
            }
        }
    }

    handleSignupClick(e) {
        e.preventDefault();
        $('.ui.login.modal').modal('toggle');
        this.context.executeAction(navigateAction, {
            url: '/signup'
        });
        // return false;
    }

    handleNoAccessClick(e) {
        e.preventDefault();
        $('.ui.login.modal').modal('toggle');
        this.context.executeAction(navigateAction, {
            url: '/resetpassword'
        });
    }

    socialLogin(provider, e) {
        e.preventDefault();
        console.log('Hit on social login icon', provider);
        this.provider = provider;

        $('.ui.login.modal').modal('toggle');

        //prepare localStorage
        localStorage.setItem(MODI, 'login');
        localStorage.setItem(NAME, '');

        //observe storage
        $(window).off('storage').on('storage', this.handleStorageEvent.bind(this));

        //create new window
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

    handleStorageEvent(e) {
        console.log('storage event', e.key, localStorage.getItem(e.key));
        //this is available

        if (e.key !== NAME || localStorage.getItem(MODI) !== 'login')
            return;

        let data = {};
        try {
            data = JSON.parse(localStorage.getItem(e.key));
        } catch (err) {
            console.log('Error while parsing data', err);
            return;
        }
        finally {
            //delete data
            localStorage.setItem(NAME, '');
        }

        //add language before send to service
        let language = common.getIntlLanguage();
        data.language = language;

        // console.log('LoginModal got social data', data);

        //check data - valid and not empty
        if ( (data.token.length < 1)
          || (data.provider.length < 3)
          || (data.token_creation.length < 22) )
            //Failure
            return;

        if ( (data.email === undefined || data.email.indexOf('@') === -1 || data.email.indexOf('.') === -1 || data.email.length < 5) ) {
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

            return;
        }

        let thatContext = this.context;
        async.series([
            function(callback) {
                thatContext.executeAction(newSocialData, data);
                callback(null, 'two');
            },
            function(callback) {
                thatContext.executeAction(userSocialSignIn, data);
                callback(null, 'two');
            }
        ]);
    }

    getProviderName() {
        if (this.provider.length < 1)
            return '';
        return this.provider.charAt(0).toUpperCase() + this.provider.slice(1);
    }

    render() {
        let inputField_classes = classNames({
            'ui': true,
            'five': true,
            'wide': true,
            'icon': true,
            'disabled': this.isLoading,
            'input': true,
            'loading': this.isLoading,
            'field': true
        });

        return(
          <div>
            <div className="ui login modal" id='signinModal' style={modalStyle}>
              <div className="header">
                  <h1 style={headerStyle}>Sign In</h1>
              </div>
              <div className="content">
                <div className="ui container">

                    <div className="ui blue padded center aligned segment">
                      <form className="ui form signin">
                        <div className={inputField_classes}>
                          <div><label htmlFor="email1" hidden>E-Mail</label></div>
                          <input type="text" id="email1" name="email1" ref="email1" placeholder="E-Mail" autoFocus tabIndex="0" aria-required="true" required/><i className="mail icon"/>
                        </div>
                        <br/>
                        <div className={inputField_classes}>
                          <div><label htmlFor="password1" hidden>Password</label></div>
                          <input type="password" id="password1" name="password1" ref="password1" placeholder="Password" tabIndex="0" aria-required="true" required/><i className="lock icon"/>
                        </div>
                        <br/>
                        <div className="ui center aligned">
                            <button type="submit" className="ui blue labeled submit icon button" onClick={this.signin}><i className="icon sign in"/> Sign In</button>
                        </div>
                        <br/>

                        <div className="ui error message"/>
                      </form>
                      <br/>
                      <div className="container">
                        {/*<i className="big circular facebook square link icon" onClick={this.socialLogin.bind(this, 'facebook')} ></i>*/}
                        <i className="big circular google plus link icon" onClick={this.socialLogin.bind(this, 'google')} ></i>
                        <i className="big circular github link icon" onClick={this.socialLogin.bind(this, 'github')} ></i>
                      </div>
                      <br/>
                      <div className="ui floated right">
                          <a href="#" onClick={this.handleNoAccessClick}>I can not access my account</a>
                          <br/><br/>
                          <a href="#" onClick={this.handleSignupClick}>Don&apos;t have an account? Sign up here.</a>
                      </div>
                    </div>
                </div>
              </div>
              <div className="actions">
                <button type="cancel" className="ui cancel button">
                  <i className="remove icon"/>Close
                </button>
              </div>
            </div>
          </div>
        );
    }
}

LoginModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default LoginModal;
