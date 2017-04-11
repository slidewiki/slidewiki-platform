import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import PermissionsStore from '../../../stores/PermissionsStore';
import forkDeck from '../../../actions/decktree/forkDeck';
import ContentUtil from './util/ContentUtil';
import {navigateAction, NavLink} from 'fluxible-router';
import {Button, Icon, Modal, Header} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import _ from 'lodash';
class NoPermissionsModal extends React.Component {

    constructor(props) {
        super(props);
    }

    handleFork() {
        this.context.executeAction(forkDeck, {selector: this.props.selector, mode: 'edit'});
    }

    handleClose() {
        this.context.executeAction(navigateAction, {
            url: ContentUtil.makeNodeURL(this.props.selector, 'view')
        });
    }

    render() {
        let isModalShown = this.props.PermissionsStore.isNoPermissionsModalShown;
        let ownedForks = this.props.PermissionsStore.ownedForks;
        let lastUpdatedFork = _.maxBy(ownedForks, (fork) => new Date(fork.lastUpdate));
        let modalDescription = lastUpdatedFork != null ? <span>You can only view this deck, however you have already forked it. You can either edit your <NavLink href={'/deck/' + lastUpdatedFork.id}>version</NavLink>, otherwise you may ask the owner to grant you edit rights. You can also create yet another fork of the deck.</span> :
            <span>You can only view this deck. To make changes, you may ask the owner to grant you edit rights or fork the deck. Forking a deck means creating your copy of the deck.</span>;
        return (
            <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='permissionsModalHeader' aria-describedby='permissionsModalDesc'  open={isModalShown}
                   onClose={this.handleClose.bind(this)}>
                <Header icon='warning sign' content='No Edit Rights' id='permissionsModalHeader'/>
                <Modal.Content>
                    <p id='permissionsModalDesc'>{modalDescription}</p>
                </Modal.Content>
                <Modal.Actions>
                    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={isModalShown}>
                        <Button as='button' disabled>
                            <Icon name='edit'/> Request edit access
                        </Button>
                        <Button as='button' onClick={this.handleFork.bind(this)}>
                            <Icon name='fork'/> Fork this deck
                        </Button>
                        <Button as='button' onClick={this.handleClose.bind(this)}>
                            <Icon name='close'/> Close
                        </Button>
                    </FocusTrap>
                </Modal.Actions>
            </Modal>
        );
    }
}

NoPermissionsModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

NoPermissionsModal = connectToStores(NoPermissionsModal, [PermissionsStore], (context, props) => {
    return {
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default NoPermissionsModal;
