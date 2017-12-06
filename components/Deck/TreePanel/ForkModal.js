import React from 'react';
import {navigateAction} from 'fluxible-router';
import forkDeck from '../../../actions/decktree/forkDeck';
import {Button, Icon, Modal, Header} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import _ from 'lodash';


class ForkModal extends React.Component {

    constructor(props) {
        super(props);
    }

    handleFork() {
        swal({
            title: 'New Fork',
            text: 'We are forking the deck...',
            type: 'success',
            timer: 2000,
            showCloseButton: false,
            showCancelButton: false,
            allowEscapeKey: false,
            showConfirmButton: false
        })
            .then(() => {/* Confirmed */}, (reason) => {/* Canceled */});
        this.context.executeAction(forkDeck, {selector: this.props.selector, navigateToRoot: true});
        this.props.handleClose();
    }

    navigateToFork() {
        let lastUpdatedFork = _.maxBy(this.props.forks, (fork) => new Date(fork.lastUpdate));
        this.context.executeAction(navigateAction, {
            url: '/deck/' + lastUpdatedFork.id
        });
        this.props.handleClose();
    }

    render() {
        let modalDescription = this.props.forks.length > 0 ?
            <span>You already own a fork of this deck. Do you want to create yet another fork of it?</span> :
            <span>Are you sure you want to create a fork of this deck? Forking a deck means creating your copy of the deck.</span>;

        return (
            <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='forkModalHeader'
                aria-describedby='forkModalDesc' open={this.props.isOpen}
                onClose={this.props.handleClose}>
                <Header icon='fork' content='Fork a deck' id='forkModalHeader'/>
                <Modal.Content>
                    <p id='forkModalDesc'>{modalDescription}</p>
                </Modal.Content>
                <Modal.Actions>
                    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.isOpen}>
                        <div>
                            {this.props.forks.length > 0 ? <Button as='button' onClick={this.navigateToFork.bind(this)}>Go to your version</Button> : ''}
                            <Button as='button' onClick={this.handleFork.bind(this)}><Icon name='fork'/> Fork this deck</Button>
                            <Button as='button' onClick={this.props.handleClose}><Icon name='close'/> Close</Button>
                        </div>
                    </FocusTrap>
                </Modal.Actions>
            </Modal>
        );
    }
}

ForkModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ForkModal;
