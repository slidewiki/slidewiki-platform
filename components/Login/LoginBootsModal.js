import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';



class LoginBootsModal extends React.Component {
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
              <button ref="loginButton2" className="ui inverted button" onClick={this.handleLoginButton}>Login2</button>
            <Modal isOpen={this.state.openModal}  onRequestHide={this.handleExitButton}>
             <ModalHeader>
               <ModalClose onClick={this.handleExitButton} aria-label="Close"/>
               <ModalTitle> Login </ModalTitle>

             </ModalHeader>
              <ModalBody>
                <div className="ui container">

                  <div className="ui blue padded center aligned segment">

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
                     <div className="ui floated right ">
                        <a href="">I can not access my account</a>
                      </div>
                    </div>
                </div>

              </ModalBody>
            </Modal>
          </div>
      );
    }
}

export default LoginBootsModal;
