import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import PermissionsStore from '../../../stores/PermissionsStore';
import forkDeck from '../../../actions/decktree/forkDeck';
import {NavLink, navigateAction} from 'fluxible-router';
import {Button, Icon, Modal, Header} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import _ from 'lodash';
import hideNoPermissionsModal from '../../../actions/permissions/hideNoPermissionsModal';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import requestEditRights from '../../../actions/permissions/requestEditRights';
import EditRightsStore from '../../../stores/EditRightsStore';
import { FormattedMessage, defineMessages } from 'react-intl';


class NoPermissionsModal extends React.Component {

    constructor(props) {
        super(props);
        this.loading = false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.EditRightsStore.errorCode !== this.props.EditRightsStore.errorCode) {
            this.loading = false;
            if (nextProps.EditRightsStore.errorCode > 0) {
                this.context.executeAction(hideNoPermissionsModal);
                swal({
                    title: 'Error',
                    text: 'An error occured. Please try again later.',
                    type: 'error',
                    confirmButtonText: 'Close',
                    confirmButtonClass: 'negative ui button',
                    buttonsStyling: false
                }).then().catch();
            }
        }
        if (nextProps.EditRightsStore.state !== this.props.EditRightsStore.state && nextProps.EditRightsStore.state === 'alreadyRequested') {
            this.loading = false;
            this.context.executeAction(hideNoPermissionsModal);
            swal({
                title: 'Info',
                text: 'You already requested deck edit rights on this deck. Please wait until the deck owner reacts.',
                type: 'info',
                confirmButtonText: 'Close',
                confirmButtonClass: 'negative ui button',
                allowEscapeKey: true,
                allowOutsideClick: true,
                buttonsStyling: false
            })
            .then(() => {
                return true;
            })
            .catch();
        }
        else if (nextProps.EditRightsStore.state !== this.props.EditRightsStore.state && nextProps.EditRightsStore.state === 'success') {
            this.loading = false;
            this.context.executeAction(hideNoPermissionsModal);
            swal({
                title: 'Success',
                text: 'The request was send. Please wait until the deck owner reacts.',
                type: 'info',
                confirmButtonText: 'OK',
                confirmButtonClass: 'ui button',
                allowEscapeKey: true,
                allowOutsideClick: true,
                buttonsStyling: false
            })
            .then(() => {
                return true;
            })
            .catch();
        }
    }

    handleFork() {
        this.context.executeAction(forkDeck, {selector: this.props.selector, mode: 'edit'});
        this.context.executeAction(hideNoPermissionsModal);
    }

    handleClose() {
        this.context.executeAction(hideNoPermissionsModal);
    }

    navigateToLatestRevision() {
        this.context.executeAction(navigateAction, {
            url: '/deck/' + this.props.DeckTreeStore.selector.get('id').split('-')[0] + '-' + this.props.DeckTreeStore.latestRevisionId
        });
        this.context.executeAction(hideNoPermissionsModal);
    }

    navigateToOwnedFork() {
        let lastUpdatedFork = _.maxBy(this.props.PermissionsStore.ownedForks, (fork) => new Date(fork.lastUpdate));
        this.context.executeAction(navigateAction, {
            url: '/deck/' + lastUpdatedFork.id
        });
        this.context.executeAction(hideNoPermissionsModal);
    }

    handleRequestEditAccess() {
        this.context.executeAction(requestEditRights, {deckid: this.props.PermissionsStore.deckId});
        this.loading = true;
    }

    render() {
        let {isNoPermissionsModalShown, ownedForks, permissions} = this.props.PermissionsStore;
        let headerText, modalDescription, buttons;
        let closeButton = <Button as='button' onClick={this.handleClose.bind(this)}><Icon name='close'/> Close</Button>;
        if (permissions.edit) {
            headerText = 'View-only version';
            modalDescription = 'You are viewing an older version of this deck, which is not available for editing. You can visit the most recent version so you can edit the deck.';

            buttons = <div>
                <Button as='button' onClick={this.navigateToLatestRevision.bind(this)}>Go to the latest version</Button>
                {closeButton}
            </div>;
        } else {
            headerText = 'No Edit Rights';
            modalDescription = ownedForks.length > 0 ?
                <span>You can only view this deck, however you have already forked it. You can either edit your version, otherwise you may ask the owner to grant you edit rights. You can also create yet another fork of the deck.</span> :
                <span>You can only view this deck. To make changes, you may ask the owner to grant you edit rights or fork the deck. Forking a deck means creating your copy of the deck.</span>;
            buttons = <div>
                <Button as='button' onClick={this.handleRequestEditAccess.bind(this)}><Icon name='edit'/> Request edit access</Button>
                {ownedForks.length > 0 ? <Button as='button' onClick={this.navigateToOwnedFork.bind(this)}>Go to your version</Button> : ''}
                <Button as='button' onClick={this.handleFork.bind(this)}><Icon name='fork'/> Fork this deck</Button>
                {closeButton}
            </div>;
        }
        return (
            <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='permissionsModalHeader'
                   aria-describedby='permissionsModalDesc' open={isNoPermissionsModalShown}
                   onClose={this.handleClose.bind(this)}>
                <Header icon='warning sign' content={headerText} id='permissionsModalHeader'/>
                <Modal.Content>
                    <p id='permissionsModalDesc'>{modalDescription}</p>
                </Modal.Content>
                <Modal.Actions>
                    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={isNoPermissionsModalShown}>
                        {(this.loading) ? <div className="ui active dimmer"><div className="ui text loader"><FormattedMessage id='Integration.loading' defaultMessage='loading'/></div></div> : ''}
                        {buttons}
                    </FocusTrap>
                </Modal.Actions>
            </Modal>
        );
    }
}

NoPermissionsModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

NoPermissionsModal = connectToStores(NoPermissionsModal, [PermissionsStore, DeckTreeStore, EditRightsStore], (context, props) => {
    return {
        PermissionsStore: context.getStore(PermissionsStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        EditRightsStore: context.getStore(EditRightsStore).getState()
    };
});
export default NoPermissionsModal;
