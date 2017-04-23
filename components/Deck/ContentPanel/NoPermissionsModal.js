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


class NoPermissionsModal extends React.Component {

    constructor(props) {
        super(props);
    }

    handleFork() {
        this.context.executeAction(forkDeck, {selector: this.props.selector, mode: 'edit'});
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
            let lastUpdatedFork = _.maxBy(ownedForks, (fork) => new Date(fork.lastUpdate));
            modalDescription = lastUpdatedFork != null ?
                <span>You can only view this deck, however you have already forked it. You can either edit your <NavLink
                    href={'/deck/' + lastUpdatedFork.id}>version</NavLink>, otherwise you may ask the owner to grant you edit rights. You can also create yet another fork of the deck.</span> :
                <span>You can only view this deck. To make changes, you may ask the owner to grant you edit rights or fork the deck. Forking a deck means creating your copy of the deck.</span>;
            buttons = <div>
                <Button as='button' disabled><Icon name='edit'/> Request edit access</Button>
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
                        {buttons}
                    </FocusTrap>
                </Modal.Actions>
            </Modal>
        );
    }
}

NoPermissionsModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

NoPermissionsModal = connectToStores(NoPermissionsModal, [PermissionsStore, DeckTreeStore], (context, props) => {
    return {
        PermissionsStore: context.getStore(PermissionsStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default NoPermissionsModal;
