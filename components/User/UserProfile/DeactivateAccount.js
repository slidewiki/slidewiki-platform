import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import removeUser from '../../../actions/user/userprofile/removeUser';
import {showDeactivateAccountModal, hideDeactivateAccountModal} from '../../../actions/user/userprofile/functionsForDeactivateAccountModal';
import FocusTrap from 'focus-trap-react';
import {Button, Icon, Modal, Header} from 'semantic-ui-react';

class DeactivateAccount extends React.Component {

    constructor(props) {
        super(props);

        this.messages = defineMessages({
            modalHeading: {
                id: 'DeactivateAccount.modalHeading',
                defaultMessage: 'Deactivate SlideWiki Account'
            },
            modalHeader: {
                id: 'DeactivateAccount.modalHeader',
                defaultMessage: 'Are you sure you want to deactivate your SlideWiki Account?'
            },
            modalContent: {
                id: 'DeactivateAccount.modalContent',
                defaultMessage: 'Deactivating your account will remove your profile and account from SlideWiki. The content you have added to SlideWiki will remain. Do you wish to continue?'
            }
        });
    }

    handleAccountDeactivate(e) {
        e.preventDefault();
        this.context.executeAction(hideDeactivateAccountModal, {});
        this.context.executeAction(removeUser, {});
    }

    showConfirmDialog(e) {
        e.preventDefault();
        this.context.executeAction(showDeactivateAccountModal, {});
    }

    hideModal(e) {
        e.preventDefault();
        this.context.executeAction(hideDeactivateAccountModal, {});
    }

    render() {
        let header = this.context.intl.formatMessage(this.messages.modalHeading);
        let text1 = this.context.intl.formatMessage(this.messages.modalHeader);
        let text2 = this.context.intl.formatMessage(this.messages.modalContent);
        let showModal = this.props.showModal;

        return (
            <div>
              <div className="ui padded grid">
                <p>
                  <FormattedMessage
                    id='DeactivateAccount.infoMessage1'
                    defaultMessage='In case you deactivate your account, all of your data will remain. This includes your user data, your authorship of decks and slides, your linked social providers and also your authorship of any comments and discussions. '
                  />
                  <strong>
                    <FormattedMessage
                      id='DeactivateAccount.infoMessage2'
                      defaultMessage='This is reversible, but needs an administrator to re-activate your account!'
                    />
                  </strong>
                </p>
                <button className="ui centered red labeled icon button" onClick={ this.showConfirmDialog.bind(this) } role="button" tabIndex="0">
                  <i className="icon ban"/>
                  <FormattedMessage
                    id='DeactivateAccount.button1'
                    defaultMessage='Deactivate my account'
                  />
                </button>
              </div>

              <Modal dimmer='blurring' ref="modal1" role='dialog' aria-labelledby='deactivateAccountModalHeader'
                     aria-describedby='deactivateAccountModalDesc' open={showModal} >
                  <Header color="red" content={header} id='deactivateAccountModalHeader'/>
                  <Modal.Content id='deactivateAccountModalDesc'>
                      <Header>
                        {text1}
                      </Header>
                      <p>
                        {text2}
                      </p>
                  </Modal.Content>
                  <Modal.Actions>
                      <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={showModal}>
                        <Button primary role="button" tabIndex="0" onClick={ this.hideModal.bind(this) }>
                            <FormattedMessage
                              id='DeactivateAccount.modalCancel'
                              defaultMessage=' Cancel'
                            />
                        </Button>
                        <Button icon labelPosition='right' onClick={ this.handleAccountDeactivate.bind(this) } role="button" tabIndex="0">
                            <Icon name='sign out' />
                            <FormattedMessage
                              id='DeactivateAccount.modalSubmit'
                              defaultMessage=' Deactivate account'
                            />
                        </Button>
                      </FocusTrap>
                  </Modal.Actions>
              </Modal>
          </div>
        );
    }
}

DeactivateAccount.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default DeactivateAccount;
