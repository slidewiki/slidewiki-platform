import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';
import {Button, Icon, Modal, Header, TextArea, Segment, Container, Menu} from 'semantic-ui-react';
import { FormattedMessage, defineMessages } from 'react-intl';
import UserPicture from '../../../../common/UserPicture';
import hideTransferOwnershipModal from '../../../../../actions/deckedit/hideTransferOwnershipModal';
import transferOwnership from '../../../../../actions/deckedit/transferOwnership';
import deckDeletion from '../../../../../actions/deckedit/deckDeletion';

class TransferOwnership extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);

        this.messages = defineMessages({
            modalHeading: {
                id: 'TransferOwnership.modalHeading',
                defaultMessage: 'Transfer Ownership'
            },
            close: {
                id: 'TransferOwnership.cancel',
                defaultMessage: 'Cancel'
            },
            unknownCountry: {
                id: 'TransferOwnership.unknownCountry',
                defaultMessage: 'unknown country'
            },
            unknownOrganization: {
                id: 'TransferOwnership.unknownOrganization',
                defaultMessage: 'Unknown organization'
            },
            linkHint: {
                id: 'TransferOwnership.linkHint',
                defaultMessage: 'The username is a link which will open a new browser tab. Close it when you want to go back to this page.'
            },
            continue: {
                id: 'TransferOwnership.continue',
                defaultMessage: 'Transfer deck'
            },
            delete: {
                id: 'TransferOwnership.delete',
                defaultMessage: 'Delete deck'
            },
        });

        this.state = {
            selectedUser: ''
        };
    }

    handleClose() {
        $('#app').attr('aria-hidden','false');
        this.context.executeAction(hideTransferOwnershipModal, {});
    }

    unmountTrap() {
        // TODO commented this out as it appeared to cause trouble with flux and cascading updates,
        // and it was impossible to get the transfer success dialog up
        // this.handleClose();
        $('#app').attr('aria-hidden','false');
    }

    handleContinue() {
        $('#app').attr('aria-hidden','false');
        this.context.executeAction(transferOwnership, {deckid: this.props.deckid, userid: this.state.selectedUser});
    }

    handleDelete() {
        $('#app').attr('aria-hidden','false');
        this.context.executeAction(deckDeletion, { id: this.props.deckid });
    }

    render() {
        let editors = [];

        if (this.props.users !== undefined && this.props.users.length > 0) {
            this.props.users.forEach((user) => {
                const optionalText = (user.organization || user.country) ?
                    (user.organization || this.context.intl.formatMessage(this.messages.unknownOrganization)) + ', ' + (user.country || this.context.intl.formatMessage(this.messages.unknownCountry)) :
                    '';
                editors.push(
                  (
                    <Menu.Item name={'item_' + user.username} key={user.id || user.userid} tabIndex={0}
                      active={this.state.selectedUser === (user.id || user.userid)}
                      onClick={() => this.setState({selectedUser: user.id || user.userid})}
                      onKeyPress={(e) => e.key === 'Enter' && this.setState({selectedUser: user.id || user.userid})} >
                      <div className="ui grid middle aligned">
                        <div className="two wide column center aligned">
                          <UserPicture picture={ user.picture } username={ user.username } avatar={ true } width= { 30 } />
                        </div>
                        <div className="twelve wide column">
                          <TextArea className="sr-only" id={'usernameIsALinkHint' + (user.id || user.userid)} value={this.context.intl.formatMessage(this.messages.linkHint)} tabIndex ='-1'/>
                          <a className="header" href={'/user/' + user.username} target="_blank">{user.displayName || user.username}</a>
                          <br/>
                          {optionalText}
                        </div>
                        <div className="two wide column center aligned">
                        { this.state.selectedUser === (user.id || user.userid) && 
                          <i className="big check circle green icon"></i>
                        }
                        </div>
                      </div>
                    </Menu.Item>
                  )
                );
            });
        }

        let showModal = this.props.show;

        return (
          <Modal dimmer='blurring'
            ref="modal1"
            role='dialog'
            aria-labelledby='transferownershipmodal_header'
						aria-describedby='transferownershipmodal_content'
            open={showModal}
            tabIndex="0" >
              <FocusTrap focusTrapOptions={{
                  clickOutsideDeactivates: true,
                  onDeactivate: this.unmountTrap,
                  initialFocus:'#transferownershipmodal_content'
              }}
                active={showModal}
                id="focusTrapGroupDetailsModal"
                className="header">
								<Modal.Header as="h1" content={this.context.intl.formatMessage(this.messages.modalHeading)} id='transferownershipmodal_header'/>
								<Modal.Content id='transferownershipmodal_content' tabIndex="0">
                  <Container>
                    <Segment color="blue">
                      <Segment basic>
      									<p>Other users have rights to edit this deck. You can transfer the deck to another editor or delete the deck for everyone.
                        </p>
      									<Menu size='small' vertical style={{width: '100%'}}>
      											{editors}
      									</Menu>
                      </Segment>
                      <Segment basic textAlign="center">
                        <Modal.Actions>
    											<Button onClick={ this.handleContinue.bind(this) } role="button" tabIndex="0" aria-label={this.context.intl.formatMessage(this.messages.continue)} disabled={this.state.selectedUser === ''} positive>
    													{this.context.intl.formatMessage(this.messages.continue)}
    											</Button>
                          <Button onClick={ this.handleDelete.bind(this) } role="button" tabIndex="0" aria-label={this.context.intl.formatMessage(this.messages.delete)} negative>
                              {this.context.intl.formatMessage(this.messages.delete)}
                          </Button>
                          <Button onClick={ this.handleClose } role="button" tabIndex="0" aria-label={this.context.intl.formatMessage(this.messages.close)}>
    													{this.context.intl.formatMessage(this.messages.close)}
    											</Button>
        								</Modal.Actions>
                      </Segment>
                    </Segment>
                  </Container>
								</Modal.Content>

              </FocusTrap>
						</Modal>
        );

        window.scrollTo(0, 0);
    }
}

TransferOwnership.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default TransferOwnership;
