import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import ContentUtil from '../../util/ContentUtil';
import {updateAuthorizedUsers} from '../../../../../actions/updateDeckAuthorizations';
import { FormattedMessage, defineMessages } from 'react-intl';
import {Button, Modal, Header} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';

import DeckPropertiesEditor from './DeckPropertiesEditor';


class DeckEditPanel extends React.Component {
    constructor(props){
        super(props);

        this.action = 0;
        this.isModalOpen = false;
        this.user = {};
        this.users = [];

        this.messages = defineMessages({
            loading: {
                id: 'noPermissionModal.loading',
                defaultMessage: 'loading'
            },
            error: {
                id: 'deckEditPanel.error',
                defaultMessage: 'Error'
            },
            info: {
                id: 'deckEditPanel.info',
                defaultMessage: 'Information'
            },
            notTheDeckOwner: {
                id: 'deckEditPanel.notTheDeckOwner',
                defaultMessage: 'You are not the deck owner, thus you are not allowed to change the deck edit rights.'
            },
            confirm: {
                id: 'deckEditPanel.confirm',
                defaultMessage: 'Confirm'
            },
            deckOwnerAndRights: {
                id: 'deckEditPanel.deckOwnerAndRights',
                defaultMessage: 'You are the owner of the deck, thus you already have edit rights.'
            },
            alreadyGranted: {
                id: 'deckEditPanel.alreadyGranted',
                defaultMessage: 'Edit rights were already granted to the user.'
            },
            organization: {
                id: 'deckEditPanel.organization',
                defaultMessage: ', organization: '
            },
            requestedDeckEditRights: {
                id: 'deckEditPanel.requestedDeckEditRights',
                defaultMessage: 'Requested deck edit rights'
            },
            theFollowingUserRequested: {
                id: 'deckEditPanel.theFollowingUserRequested',
                defaultMessage: 'The following user requested edit rights on deck'
            },
            grantIt: {
                id: 'deckEditPanel.grantIt',
                defaultMessage: 'Grant it?'
            },
            grantRights: {
                id: 'deckEditPanel.grantRights',
                defaultMessage: 'Grant rights'
            },
            deny: {
                id: 'deckEditPanel.deny',
                defaultMessage: 'Deny'
            },
            close: {
                id: 'noPermissionModal.close',
                defaultMessage: 'Close'
            }
        });
    }

    handleAuth(selector) {
        // console.log('DeckEditPanel handleAuth:', selector);
        if (this.getParameterByName('interestedUser') && this.props.UserProfileStore.username === '') {
            return;
        }
        const nodeURL = ContentUtil.makeNodeURL(selector, 'view');
        //user is not logged in
        if (this.props.UserProfileStore.username === '') {
            this.context.executeAction(navigateAction, {
                url: nodeURL
            });
        }
        return (<div>Sign-in needed!</div>);
    }

    getParameterByName(name) {
        try {
            let param = this.props.DeckEditStore.queryParams[name];
            return decodeURIComponent(param.replace(/\+/g, ' '));
        } catch (e) {
            // console.log('Not able to get query parameter!', e);
            return undefined;
        }
    }

    componentDidMount() {
        let interestedUser = this.getParameterByName('interestedUser');
        if (interestedUser && this.props.UserProfileStore.username === '') {
            $('.ui.login.modal').modal('show');
            return;
        }
        const nodeURL = ContentUtil.makeNodeURL(this.props.selector, 'view');
        // console.log('componentDidMount', interestedUser, this.props.DeckEditStore.deckProps.deckOwner, this.props.UserProfileStore.userid);
        if (interestedUser) {
            this.users = this.props.DeckEditStore.authorizedUsers;
            if (this.users === undefined || this.users === null)
                this.users = [];
            this.user = this.props.UserProfileStore.user;
            if (this.props.DeckEditStore.deckProps.deckOwner !== this.props.UserProfileStore.userid) {
                swal({
                    title: this.context.intl.formatMessage(this.messages.error),
                    text: this.context.intl.formatMessage(this.messages.notTheDeckOwner),
                    type: 'error',
                    confirmButtonText: this.context.intl.formatMessage(this.messages.confirm),
                    confirmButtonClass: 'positive ui button',
                    buttonsStyling: false
                }).then(() => this.context.executeAction(navigateAction, {
                    url: nodeURL
                })).catch(() => this.context.executeAction(navigateAction, {
                    url: nodeURL
                }));
            }
            else if (this.props.DeckEditStore.deckProps.deckOwner === this.props.UserProfileStore.user.id) {
                swal({
                    title: this.context.intl.formatMessage(this.messages.info),
                    text: this.context.intl.formatMessage(this.messages.deckOwnerAndRights),
                    type: 'info',
                    confirmButtonText: this.context.intl.formatMessage(this.messages.confirm),
                    confirmButtonClass: 'positive ui button',
                    buttonsStyling: false
                }).then(() => this.context.executeAction(navigateAction, {
                    url: nodeURL
                })).catch(() => this.context.executeAction(navigateAction, {
                    url: nodeURL
                }));
            }
            else if (this.users.findIndex((member) => {
                return member.id === parseInt(this.user.id);
            }) !== -1) {
                swal({
                    title: this.context.intl.formatMessage(this.messages.info),
                    text: this.context.intl.formatMessage(this.messages.alreadyGranted),
                    type: 'info',
                    confirmButtonText: this.context.intl.formatMessage(this.messages.confirm),
                    confirmButtonClass: 'positive ui button',
                    buttonsStyling: false
                }).then(() => this.context.executeAction(navigateAction, {
                    url: nodeURL
                })).catch(() => this.context.executeAction(navigateAction, {
                    url: nodeURL
                }));
            }
            else {
                this.isModalOpen = true;
                this.forceUpdate();
            }
        }
    }

    handleClose() {
        this.isModalOpen = false;
        this.forceUpdate();
        this.context.executeAction(navigateAction, {
            url: ContentUtil.makeNodeURL(this.props.selector, 'view')
        });
    }

    handleAddUser() {
        // console.log('Try to push user to users', users, user);
        this.users.push({
            username: this.user.uname,
            id: parseInt(this.user.id),
            joined: (new Date()).toISOString(),
            picture: this.user.picture,
            country: this.user.country,
            organization: this.user.organization
        });
        // console.log('execute action');
        this.isModalOpen = false;
        this.forceUpdate();
        this.action = 1;
        this.context.executeAction(updateAuthorizedUsers, this.users);
    }

    componentDidUpdate() {
        // console.log('DeckEditPanel componentDidUpdate', this.action);
        if (this.action === 1) {
            this.action = 0;
            document.getElementsByClassName('ui primary button')[0].click();
        }
    }

    render() {
        //make sure user is logged-in
        this.handleAuth(this.props.selector);

        let username = this.props.UserProfileStore.user.fname + ' ' + this.props.UserProfileStore.user.lname + ' (' + this.props.UserProfileStore.user.uname + ')';
        if (!this.props.UserProfileStore.user.lname && !this.props.UserProfileStore.user.fname)
            username = this.props.UserProfileStore.user.uname;
        let organization = '';
        if (this.props.UserProfileStore.user.organization) {
            organization = this.context.intl.formatMessage(this.messages.organization) + this.props.UserProfileStore.user.organization;
        }

        let headerText = this.context.intl.formatMessage(this.messages.requestedDeckEditRights);
        let modalDescription = this.context.intl.formatMessage(this.messages.theFollowingUserRequested) + ' "' + this.props.DeckEditStore.deckProps.title + '":   ' + username + organization + '. ' + this.context.intl.formatMessage(this.messages.grantIt);
        let buttons = <div>
            <Button as='button' onClick={this.handleAddUser.bind(this)} positive>{this.context.intl.formatMessage(this.messages.grantRights)}</Button>
            <Button as='button' onClick={this.handleClose.bind(this)} negative>{this.context.intl.formatMessage(this.messages.deny)}</Button>
        </div>;

        return (
            <div ref="deckEditPanel" className="ui bottom attached segment">
                <DeckPropertiesEditor deckProps={this.props.DeckEditStore.deckProps}
                  selector={this.props.selector}
                  userid={this.props.UserProfileStore.userid}
                  groups={this.props.UserProfileStore.user.groups}/>

              <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='grantRightsModalHeader'
                     aria-describedby='grantRightsModalDesc' open={this.isModalOpen}
                     onClose={this.handleClose.bind(this)}>
                  <Header icon='warning sign' content={headerText} id='grantRightsModalHeader'/>
                  <Modal.Content>
                      <p id='grantRightsModalDesc'>{modalDescription}</p>
                  </Modal.Content>
                  <Modal.Actions>
                      <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.isModalOpen}>
                          {(this.loading) ? <div className="ui active dimmer"><div className="ui text loader">{this.context.intl.formatMessage(this.messages.loading)}</div></div> : ''}
                          {buttons}
                      </FocusTrap>
                  </Modal.Actions>
              </Modal>
            </div>
        );
    }
}
DeckEditPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

DeckEditPanel = connectToStores(DeckEditPanel, [DeckEditStore, UserProfileStore], (context, props) => {
    return {
        DeckEditStore: context.getStore(DeckEditStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default DeckEditPanel;
