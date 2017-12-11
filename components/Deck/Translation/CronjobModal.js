import React from 'react';
import FocusTrap from 'focus-trap-react';

import {connectToStores} from 'fluxible-addons-react';
import TranslationStore from '../../../stores/TranslationStore';

import {  Dropdown, Button, Modal, Icon, Header, Divider} from 'semantic-ui-react';


import toggleCronjobModal from '../../../actions/decktree/toggleCronjobModal';


class CronjobModal extends React.Component {

    constructor(props) {
        super(props);
        //this.state = {language: null, error:false, previewModal:false, previewLanguage: null, cronjobModalOpen: true};
    }

    handleCronjobModalClose(){
        this.context.executeAction(toggleCronjobModal);
    }

    render() {

        return (
            <Modal dimmer='blurring' role='dialog' aria-labelledby='cronjobModalHeader' open={this.props.TranslationStore.isCronjobModalOpen}>
                <Header icon='translate' content={'Translation is in progress'} id='cronjobModalHeader'/>
                <Modal.Content>
                    <p> The translation of a deck with more than 20 slides in it takes time.
                    The deck has been added to the queue. You will be notified when the job is done. </p>
                </Modal.Content>
                <Modal.Actions>
                    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.TranslationStore.isCronjobModalOpen}>
                        <Button as='button' primary onClick={this.handleCronjobModalClose.bind(this)}><Icon name='close'/> Close</Button>
                    </FocusTrap>
                </Modal.Actions>
            </Modal>

        );
    }
}

CronjobModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
CronjobModal = connectToStores(CronjobModal, [TranslationStore,], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState(),
    };
});

export default CronjobModal;
