import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import userSignIn from '../../actions/user/userSignIn';
import userSignOut from '../../actions/user/userSignOut';
import UserProfileStore from '../../stores/UserProfileStore';
import HeaderDropdown from './HeaderDropdown.js';
import ReactDOM from 'react-dom';
import {hashPassword} from '../../configs/general';
let classNames = require('classnames');

const headerStyle = {
    'textAlign': 'center'
};
const modalStyle = {
    top: '15%'
};

class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.handleSignupClick = this.handleSignupClick.bind(this);
        this.handleNoAccessClick = this.handleNoAccessClick.bind(this);
        this.signin = this.signin.bind(this);
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

            this.refs.email1.value = '';
            this.refs.password1.value = '';
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.UserProfileStore.errorMessage !== '') {
            $('.ui.form.signin').form('add errors', [nextProps.UserProfileStore.errorMessage]);
        }
        if (this.props.UserProfileStore.userid === '' && nextProps.UserProfileStore.userid !== ''){
            $('.ui.login.modal').modal('hide');
        }
    }

    componentDidUpdate() {
        if (this.props.UserProfileStore.userid !== '') {
            //redirect if on a specific page
            if (location.pathname === '/signup' || location.pathname === '/resetpassword') {
                this.context.executeAction(navigateAction, {
                    url: '/user/' + this.props.UserProfileStore.username + '/settings'
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

    render() {
        let loginButton = (
            <HeaderDropdown/>
        );

        if (this.props.UserProfileStore.username === '') {
            loginButton = (
                <button ref="loginButton" className="ui inverted button" onClick={this.handleLoginButton}>Sign In</button>
            );
        }

        return(
          <div>
            <div className="item right" >
              {loginButton}
            </div>
            <div className="ui login modal" id='signinModal' style={modalStyle}>
              <div className="header">
                  <h1 style={headerStyle}>Sign In</h1>
              </div>
              <div className="content">
                <div className="ui container">

                    <div className="ui blue padded center aligned segment">
                      <form className="ui form signin">
                        <div className="ui five wide icon input field">
                          <div><label htmlFor="email1" hidden>E-Mail</label></div>
                          <input type="text" id="email1" name="email1" ref="email1" placeholder="E-Mail" autoFocus tabIndex="0" aria-required="true" required/><i className="mail icon"/>
                        </div>
                        <br/>
                        <div className="ui five wide icon input field">
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

LoginModal = connectToStores(LoginModal, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default LoginModal;
