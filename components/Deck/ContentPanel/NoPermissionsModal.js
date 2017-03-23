import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import PermissionsStore from '../../../stores/PermissionsStore';
import forkDeck from '../../../actions/decktree/forkDeck';
import ContentUtil from './util/ContentUtil';
import {navigateAction} from 'fluxible-router';
import {Button, Icon, Modal, Header} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';

class NoPermissionsModal extends React.Component {

    constructor(props) {
        super(props);
    }

    handleFork() {
        this.context.executeAction(forkDeck, {deckId: this.props.selector.id});
    }

    handleClose() {
        this.context.executeAction(navigateAction, {
            url: ContentUtil.makeNodeURL(this.props.selector, 'view')
        });
    }

    render() {
        let isModalShown = this.props.PermissionsStore.isNoPermissionsModalShown;
        return (
            <Modal dimmer="blurring" size='small' open={isModalShown}
                   onClose={this.handleClose.bind(this)}>
                <Header icon='warning sign' content='No Edit Rights'/>
                <Modal.Content>
                    <p>You can only view this deck. To make changes, you may ask the owner to grant you edit rights
                        or fork the deck. Forking a deck means creating your copy of the deck.</p>
                </Modal.Content>
                <Modal.Actions>
                    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={isModalShown}>
                        <Button disabled>
                            <Icon name='edit'/> Request edit access
                        </Button>
                        <Button onClick={this.handleFork.bind(this)} tabIndex="0">
                            <Icon name='fork'/> Fork this deck
                        </Button>
                        <Button onClick={this.handleClose.bind(this)} tabIndex="0">
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
