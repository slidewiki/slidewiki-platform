import React from 'react';




class LoginModalUI extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.handleExitButton = this.handleExitButton.bind(this);

    }

    handleLoginButton(){
        $('.ui.small.modal')
          .modal('show')
        ;

    }

    handleExitButton(){
        $('.ui.small.modal')
          .modal('close')
        ;

    }
    render() {
        return(
          <div className="item right" >
            <button ref="loginButton" className="ui inverted button" onClick={this.handleLoginButton}>Login3</button>
            <div className="ui small modal">
              <i className="close icon"></i>
              <div className="header">
                <h1>Login</h1>
              </div>
             <div className="content">
              <div className="ui container">
                <div className="ui blue padded center aligned segment">
                  <form id="loginForm" className="ui form signin">
                    <div className="ui five wide icon input field">
                      <div><label htmlFor="email1" hidden>Email</label></div>
                      <input type="email" id="email1" name="email1" ref="email1" placeholder="Email" autoFocus tabIndex="0"  aria-required="true"/><i className="mail icon"></i>
                    </div>
                    <br/>
                    <div className="ui five wide icon input field">
                      <div><label htmlFor="password1" hidden>Password</label></div>
                      <input type="password" id="password1" name="password1" ref="password1" placeholder="Password" tabIndex="0"  aria-required="true"/><i className="lock icon"></i>
                    </div>
                    <br/>
                    <div className="ui error message"></div>
                    <button type="submit" className="ui blue labeled submit icon button"><i className="icon sign in"></i> Login</button>
                  </form>
                  <br/>
                  <div className="ui floated right">
                    <a href="">I can not access my account</a>
                  </div>
                </div>
              </div>
             </div>

             <div className="actions">
              <button type="submit" className="ui blue labeled submit icon button" form="loginForm"><i className="icon sign in"></i> Login</button>
              <div className="ui floated right">
                <a href="">I can not access my account</a>
              </div>
             </div>
            </div>
         </div>

      );
    }
}

export default LoginModalUI;
