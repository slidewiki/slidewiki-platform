import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class LoginModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {openModal: false};
      this.handleLoginButton = this.handleLoginButton.bind(this);
    }

    handleLoginButton(){
      this.setState({openModal: true});
    }

    render() {

      return(
        <div className="item right" >
          <button id="loginButton" className="ui inverted button" onClick={this.handleLoginButton}>Login</button>
          <Modal isOpen={this.state.openModal}  style={customStyles}>
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
          </Modal>
        </div>
      );
    }
}

export default LoginModal;
