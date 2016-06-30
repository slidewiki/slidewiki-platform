import React from 'react';


class Login extends React.Component {

    render() {
        return (
        <div className="ui grid container">

              <div className="ui seven wide column">
                  <div className="ui blue padded center aligned segment">
                      <h1 className="ui dividing header">Login</h1>
                      <form className="ui form signin">

                          <div className="ui ten wide icon input field">
                              <div><label htmlFor="email1" hidden>Email</label></div>
                              <input type="email" id="email1" name="email1" ref="email1" placeholder="Email" autoFocus tabIndex="0"  aria-required="true"/><i className="mail icon"></i>
                          </div>
                          <br/>
                          <div className="ui ten wide icon input field">
                              <div><label htmlFor="password1" hidden>Password</label></div>
                              <input type="password" id="password1" name="password1" ref="password1" placeholder="Password" tabIndex="0"  aria-required="true"/><i className="lock icon"></i>
                          </div><br/>
                          <div className="ui error message"></div>
                          <button type="submit" className="ui blue labeled submit icon button">
                              <i className="icon sign in"></i> Login
                          </button>
                      </form>
                      <br/>
                      <div className="ui floated right ">
                          <a href="">I can not access my account</a>
                      </div>
                  </div>
              </div>
    
        </div>
        );
    }
}

export default Login;
