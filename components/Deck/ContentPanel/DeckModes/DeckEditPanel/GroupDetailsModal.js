import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import UserPicture from '../../../../common/UserPicture';
import FocusTrap from 'focus-trap-react';
import {Button, Icon, Modal, Header, TextArea, Segment, Container} from 'semantic-ui-react';
import {hideGroupDetailsModal} from '../../../../../actions/deckedit/functionsForGroupDetailsModal';
import { FormattedMessage, defineMessages } from 'react-intl';

class GroupDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);

        this.messages = defineMessages({
            modalHeading: {
                id: 'GroupDetails.modalHeading',
                defaultMessage: 'Group details'
            },
            close: {
                id: 'GroupDetails.close',
                defaultMessage: 'Close'
            },
            groupCreator: {
                id: 'GroupDetails.groupCreator',
                defaultMessage: 'Group creator'
            },
            unknownCountry: {
                id: 'GroupDetails.unknownCountry',
                defaultMessage: 'unknown country'
            },
            unknownOrganization: {
                id: 'GroupDetails.unknownOrganization',
                defaultMessage: 'Unknown organization'
            },
            linkHint: {
                id: 'GroupDetails.linkHint',
                defaultMessage: 'The username is a link which will open a new browser tab. Close it when you want to go back to this page.'
            }
        });
    }

    handleClose() {
	      $('#app').attr('aria-hidden','false');
	      this.context.executeAction(hideGroupDetailsModal, {});
    }

    unmountTrap() {
        this.handleClose();
    }

    render() {
        let showContent = this.props.group && this.props.group.creator;

        let members = [];
        //first the creator
        let optionalText = (showContent && (this.props.group.creator.organization || this.props.group.creator.country)) ?
            (this.props.group.creator.organization || this.context.intl.formatMessage(this.messages.unknownOrganization)) + ', ' + (this.props.group.creator.country || this.context.intl.formatMessage(this.messages.unknownCountry)) :
            '';
        if (showContent)
            members.push(
              (
                <div className="item" key={this.props.group.creator.userid}>
                  <div className="ui grid">
                    <div className="one wide column middle aligned">
                      <UserPicture picture={ this.props.group.creator.picture } username={ this.props.group.creator.username } avatar={ true } width= { 24 } />
                    </div>
                    <div className="fifteen wide column">
                      <TextArea className="sr-only" id={'usernameIsALinkHint' + this.props.group.creator.userid} value={this.context.intl.formatMessage(this.messages.linkHint)} tabIndex ='-1'/>
                      <a className="header" href={'/user/' + this.props.group.creator.username} target="_blank">{this.props.group.creator.displayName || this.props.group.creator.username}</a>
                      <div className="description">
                        {this.context.intl.formatMessage(this.messages.groupCreator)}
                      </div>
                      {optionalText}
                    </div>
                  </div>
                </div>
              )
            );
        if (showContent && this.props.group.members !== undefined && this.props.group.members.length > 0) {
            this.props.group.members.forEach((user) => {
                optionalText = (user.organization || user.country) ?
                    (user.organization || this.context.intl.formatMessage(this.messages.unknownOrganization)) + ', ' + (user.country || this.context.intl.formatMessage(this.messages.unknownCountry)) :
                    '';
                members.push(
                  (
                    <div className="item" key={user.userid}>
                      <div className="ui grid">
                        <div className="one wide column">
                          <UserPicture picture={ user.picture } username={ user.username } avatar={ true } width= { 24 } />
                        </div>
                        <div className="fifteen wide column">
                          <TextArea className="sr-only" id={'usernameIsALinkHint' + user.userid} value={this.context.intl.formatMessage(this.messages.linkHint)} tabIndex ='-1'/>
                          <a className="header" href={'/user/' + user.username} target="_blank">{user.displayName || user.username}</a>
                          {optionalText}
                        </div>
                      </div>
                    </div>
                  )
                );
            });
        }

        let showModal = this.props.show;
        let textDetails = '';
        if (showContent)
            textDetails = 'There are ' + (this.props.group.members.length+1) + ' member' + ((this.props.group.members.length !== 0) ? 's': '') + ' in this group.';

        return (
          <Modal dimmer='blurring'
            ref="modal1"
            role='dialog'
            aria-labelledby='groupdetailsmodal_header'
						aria-describedby='groupdetailsmodal_content'
            open={showModal}
            tabIndex="0" >
              <FocusTrap focusTrapOptions={{
                  clickOutsideDeactivates: true,
                  onDeactivate: this.unmountTrap,
                  initialFocus:'#groupdetailsmodal_content'
              }}
                active={showModal}
                id="focusTrapGroupDetailsModal"
                className="header">
								<Modal.Header as="h1" content={this.context.intl.formatMessage(this.messages.modalHeading)} id='groupdetailsmodal_header'/>
								<Modal.Content id='groupdetailsmodal_content' tabIndex="0">
                  <Container>
                    <Segment color="blue" textAlign="center" padded>
                      <Segment attached="bottom" textAlign="left">
      									<h3 className="header" >{this.props.group.name}</h3>
      									<p>{textDetails}</p>
      									<div className="ui very relaxed  list">
      											{members}
      									</div>
                      </Segment>
                      <Modal.Actions>
  											<Button onClick={ this.handleClose } role="button" tabIndex="0" aria-label={this.context.intl.formatMessage(this.messages.close)}>
  													{this.context.intl.formatMessage(this.messages.close)}
  											</Button>
      								</Modal.Actions>
                    </Segment>
                  </Container>
								</Modal.Content>

              </FocusTrap>
						</Modal>
        );

        window.scrollTo(0, 0);
    }
}

GroupDetailsModal.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default GroupDetailsModal;
