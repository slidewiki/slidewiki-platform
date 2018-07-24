import PropTypes from 'prop-types';
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
import Util from '../../common/Util';

class NoPermissionsModal extends React.Component {

    constructor(props) {
        super(props);
        this.loading = false;

        this.messages = defineMessages({
            loading: {
                id: 'noPermissionModal.loading',
                defaultMessage: 'loading'
            },
            error: {
                id: 'noPermissionModal.error',
                defaultMessage: 'Error'
            },
            errorMessage: {
                id: 'noPermissionModal.errorMessage',
                defaultMessage: 'An error occured. Please try again later.'
            },
            close: {
                id: 'noPermissionModal.close',
                defaultMessage: 'Close'
            },
            info: {
                id: 'noPermissionModal.info',
                defaultMessage: 'Info'
            },
            alreadyRequested: {
                id: 'noPermissionModal.alreadyRequested',
                defaultMessage: 'You already requested deck edit rights on this deck. Please wait until the deck owner reacts.'
            },
            success: {
                id: 'noPermissionModal.success',
                defaultMessage: 'Success'
            },
            requestSuccessfullySend: {
                id: 'noPermissionModal.requestSuccessfullySend',
                defaultMessage: 'The request was send. Please wait until the deck owner reacts.'
            },
            ok: {
                id: 'noPermissionModal.ok',
                defaultMessage: 'OK'
            },
            viewOnlyVersion: {
                id: 'noPermissionModal.viewOnlyVersion',
                defaultMessage: 'View-only version'
            },
            viewOnlyVersionText: {
                id: 'noPermissionModal.viewOnlyVersionText',
                defaultMessage: 'You are viewing an older version of this deck, which is not available for editing. You can visit the most recent version so you can edit the deck.'
            },
            gotoLastVersion: {
                id: 'noPermissionModal.gotoLastVersion',
                defaultMessage: 'Go to the latest version'
            },
            noEditRights: {
                id: 'noPermissionModal.noEditRights',
                defaultMessage: 'No Edit Rights'
            },
            textWithoutFork: {
                id: 'noPermissionModal.textWithoutFork',
                defaultMessage: 'You can only view this deck, however you have already forked it. You can either edit your version, otherwise you may ask the owner to grant you edit rights. You can also create yet another fork of the deck.'
            },
            textWithFork: {
                id: 'noPermissionModal.textWithFork',
                defaultMessage: 'You can only view this deck. To make changes, you may ask the owner to grant you edit rights or fork the deck. Forking a deck means creating your copy of the deck.'
            },
            requestEditAccess: {
                id: 'noPermissionModal.requestEditAccess',
                defaultMessage: 'Request edit access'
            },
            gotoYourVersion: {
                id: 'noPermissionModal.gotoYourVersion',
                defaultMessage: 'Go to your version'
            },
            forkThisDeck: {
                id: 'noPermissionModal.forkThisDeck',
                defaultMessage: 'Fork this deck'
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.EditRightsStore.errorCode !== this.props.EditRightsStore.errorCode) {
            this.loading = false;
            if (nextProps.EditRightsStore.errorCode > 0) {
                this.context.executeAction(hideNoPermissionsModal);
                swal({
                    title: this.context.intl.formatMessage(this.messages.error),
                    text: this.context.intl.formatMessage(this.messages.errorMessage),
                    type: 'error',
                    confirmButtonText: this.context.intl.formatMessage(this.messages.close),
                    confirmButtonClass: 'negative ui button',
                    buttonsStyling: false,
                    focusConfirm: true
                }).then(() => {}, () => {}).catch(() => {});
            }
            else {
                this.forceUpdate();
            }
        }
        if (nextProps.EditRightsStore.state !== this.props.EditRightsStore.state && nextProps.EditRightsStore.state === 'alreadyRequested') {
            this.loading = false;
            this.context.executeAction(hideNoPermissionsModal);
            swal({
                title: this.context.intl.formatMessage(this.messages.info),
                text: this.context.intl.formatMessage(this.messages.alreadyRequested),
                type: 'info',
                confirmButtonText: this.context.intl.formatMessage(this.messages.close),
                confirmButtonClass: 'negative ui button',
                allowEscapeKey: true,
                allowOutsideClick: true,
                buttonsStyling: false,
                focusConfirm: true
            })
            .then(() => {
                return true;
            }, () => {})
            .catch(() => {});
        }
        else if (nextProps.EditRightsStore.state !== this.props.EditRightsStore.state && nextProps.EditRightsStore.state === 'success') {
            this.loading = false;
            this.context.executeAction(hideNoPermissionsModal);
            swal({
                title: this.context.intl.formatMessage(this.messages.success),
                text: this.context.intl.formatMessage(this.messages.requestSuccessfullySend),
                type: 'info',
                confirmButtonText: this.context.intl.formatMessage(this.messages.ok),
                confirmButtonClass: 'ui button',
                allowEscapeKey: true,
                allowOutsideClick: true,
                buttonsStyling: false,
                focusConfirm: true
            })
            .then(() => {
                return true;
            }, () => {})
            .catch(() => {});
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
        let url = Util.makeNodeURL({
            id: this.props.DeckTreeStore.selector.get('id').split('-')[0] + '-' + this.props.DeckTreeStore.latestRevisionId
        }, 'plaindeck');
        this.context.executeAction(navigateAction, {
            url: url
        });
        this.context.executeAction(hideNoPermissionsModal);
    }

    navigateToOwnedFork() {
        let lastUpdatedFork = _.maxBy(this.props.PermissionsStore.ownedForks, (fork) => new Date(fork.lastUpdate));
        let url = Util.makeNodeURL({
            id: lastUpdatedFork.id
        }, 'plaindeck');
        this.context.executeAction(navigateAction, {
            url: url
        });
        this.context.executeAction(hideNoPermissionsModal);
    }

    handleRequestEditAccess() {
        this.context.executeAction(requestEditRights, {deckId: this.props.PermissionsStore.deckId});
        this.loading = true;
    }

    render() {
        let {isNoPermissionsModalShown, ownedForks, permissions} = this.props.PermissionsStore;
        let headerText, modalDescription, buttons;
        let closeButton = <Button as='button' onClick={this.handleClose.bind(this)}><Icon name='close'/> {this.context.intl.formatMessage(this.messages.close)}</Button>;
        if (permissions.edit) {
            headerText = this.context.intl.formatMessage(this.messages.viewOnlyVersion);
            modalDescription = this.context.intl.formatMessage(this.messages.viewOnlyVersionText);

            buttons = <div>
                <Button as='button' onClick={this.navigateToLatestRevision.bind(this)}>{this.context.intl.formatMessage(this.messages.gotoLastVersion)}</Button>
                {closeButton}
            </div>;
        } else {
            headerText = this.context.intl.formatMessage(this.messages.noEditRights);
            modalDescription = ownedForks.length > 0 ?
                <span>{this.context.intl.formatMessage(this.messages.textWithoutFork)}</span> :
                <span>{this.context.intl.formatMessage(this.messages.textWithFork)}</span>;
            buttons = <div>
                <Button as='button' onClick={this.handleRequestEditAccess.bind(this)}><Icon name='edit'/> {this.context.intl.formatMessage(this.messages.requestEditAccess)}</Button>
                {ownedForks.length > 0 ? <Button as='button' onClick={this.navigateToOwnedFork.bind(this)}>{this.context.intl.formatMessage(this.messages.gotoYourVersion)}</Button> : ''}
                <Button as='button' onClick={this.handleFork.bind(this)}><Icon name='fork'/> {this.context.intl.formatMessage(this.messages.forkThisDeck)}</Button>
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
                        {(this.loading) ? <div className="ui active dimmer"><div className="ui text loader">{this.context.intl.formatMessage(this.messages.loading)}</div></div> : ''}
                        {buttons}
                    </FocusTrap>
                </Modal.Actions>
            </Modal>
        );
    }
}

NoPermissionsModal.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

NoPermissionsModal = connectToStores(NoPermissionsModal, [PermissionsStore, DeckTreeStore, EditRightsStore], (context, props) => {
    return {
        PermissionsStore: context.getStore(PermissionsStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        EditRightsStore: context.getStore(EditRightsStore).getState()
    };
});
export default NoPermissionsModal;
