import React from 'react';
import Modal from 'react-modal';

const customStyles = {
    content : {
        top                   : '15%',
        left                  : '25%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%'

    }
};



class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {openModal: false};
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.handleExitButton = this.handleExitButton.bind(this);

    }

    handleLoginButton(){
        this.setState({openModal: true});

    }

    handleExitButton(){
        this.setState({openModal: false});

    }
    render() {
        return(
          <div className="item right" >
            <button ref="loginButton" className="ui inverted button" onClick={this.handleLoginButton}>Login</button>
            <Modal isOpen={this.state.openModal}  style={customStyles}>
              <div className="ui container">
                  <div className="ui right">
                    <button type="cancel" className="ui basic button" onClick={this.handleExitButton}>
                      <i className="remove icon"></i>Close
                    </button>
                  </div>
                  <div className="ui blue padded center aligned segment">
                    <h1 className="ui dividing header">Login</h1>
                      <form className="ui form signin">
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

          </Modal>
          </div>
      );
    }
}

export default LoginModal;
