import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import removeUser from '../../../actions/user/userprofile/removeUser';

class DeactivateAccount extends React.Component {

    handleAccountDeactivate(e) {
        this.context.executeAction(removeUser, {});
        $(this.refs.modal1).modal('hide');
    }

    showConfirmDialog(e) {
        $(this.refs.modal1).modal('show');
    }

    render() {
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
                <button className="ui centered red labeled icon button" onClick={ this.showConfirmDialog.bind(this) }>
                  <i className="icon ban"/>
                  <FormattedMessage
                    id='DeactivateAccount.button1'
                    defaultMessage='Deactivate my account'
                  />
                </button>
              </div>

              <div className="ui modal" ref="modal1">
                <div className="ui red header">
                  <FormattedMessage
                    id='DeactivateAccount.modalHeading'
                    defaultMessage='Deactivate SlideWiki Account'
                  />
                </div>
                <div className="image content">
                  <i className="ui massive warning sign icon"/>
                  <div className="description">
                    <div className="ui header">
                      <FormattedMessage
                        id='DeactivateAccount.modalHeader'
                        defaultMessage='Are you sure you want to deactivate your SlideWiki Account?'
                      />
                    </div>
                    <p>
                      <FormattedMessage
                        id='DeactivateAccount.modalContent'
                        defaultMessage='Deactivating your account will remove your profile and account from SlideWiki. The content you have added to SlideWiki will remain. Do you wish to continue?'
                      />
                    </p>
                  </div>
                </div>
                <div className="actions">
                  <div className="ui green right labeled icon deny button">
                    <i className="checkmark icon"></i>
                    <FormattedMessage
                      id='DeactivateAccount.modalCancel'
                      defaultMessage=' Cancel'
                    />
                  </div>
                  <div className="ui red right labeled icon button" onClick={ this.handleAccountDeactivate.bind(this) }>
                    <i className="sign out icon"></i>
                    <FormattedMessage
                      id='DeactivateAccount.modalSubmit'
                      defaultMessage=' Deactivate account'
                    />
                  </div>
                </div>
              </div>
          </div>
        );
    }
}

DeactivateAccount.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeactivateAccount;
