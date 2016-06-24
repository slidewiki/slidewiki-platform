import React from 'react';


class Login extends React.Component {

    render() {
        return (
        <div className="ui page grid">
          <div className="ui row">

            <div className="column">
              <div className="ui content">

                <form className="ui form">
                <h1 className="ui header">Login</h1>
                <div className="ten wide field">
                  <label>E-mail</label>
                  <input type="email" name="email" placeholder="E-mail address" tabIndex="0"  aria-required="true"/>
                </div>
                <br/>
                <div className="ten wide field">
                  <label>Password</label>
                  <input type="password" name="paswd" placeholder="Password" tabIndex="0" aria-required="true"/>
                </div>
                <br/>
                <div className="fields">
                 <button className="ui primary button" type="submit"  >Login</button>
              
                </div>
                </form>
              </div>
            </div>

          </div>
        </div>
        );
    }
}

export default Login;
