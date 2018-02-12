import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import removeUser from '../../../actions/user/userprofile/removeUser';
import FocusTrap from 'focus-trap-react';

class DeactivateAccount extends React.Component {

    constructor(props) {
        super(props);

        this.isModalOpen = false;

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
        this.isModalOpen = false;
        this.context.executeAction(removeUser, {});
        $(this.refs.modal1).modal('hide');
    }

    showConfirmDialog(e) {
        $(this.refs.modal1).modal('show');
        this.isModalOpen = true;
    }

    render() {
        let header = this.context.intl.formatMessage(this.messages.modalHeading);
        let text1 = this.context.intl.formatMessage(this.messages.modalHeader);
        let text2 = this.context.intl.formatMessage(this.messages.modalContent);
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

            <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.isModalOpen}>
              <div className="ui modal" ref="modal1" role="dialog" aria-label={header} aria-describedby={text1+' '+text2}>
                <div className="ui red header">
                  {header}
                </div>
                <div className="image content">
                  <i className="ui massive warning sign icon"/>
                  <div className="description">
                    <div className="ui header">
                      {text1}
                    </div>
                    <p>
                      {text2}
                    </p>
                  </div>
                </div>
                <div className="actions">
                    <div className="ui primary deny button" role="button" tabIndex="0">
                      <FormattedMessage
                        id='DeactivateAccount.modalCancel'
                        defaultMessage=' Cancel'
                      />
                    </div>
                    <div className="ui red right labeled icon button" onClick={ this.handleAccountDeactivate.bind(this) } role="button" tabIndex="0">
                      <i className="sign out icon"></i>
                      <FormattedMessage
                        id='DeactivateAccount.modalSubmit'
                        defaultMessage=' Deactivate account'
                      />
                    </div>
                </div>
              </div>
            </FocusTrap>
          </div>
        );
    }
}

DeactivateAccount.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

export default DeactivateAccount;
