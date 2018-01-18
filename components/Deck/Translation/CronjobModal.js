import React from 'react';
import FocusTrap from 'focus-trap-react';

import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';

import TranslationStore from '../../../stores/TranslationStore';

import {  Dropdown, Button, Modal, Icon, Header, Divider} from 'semantic-ui-react';


import toggleCronjobModal from '../../../actions/decktree/toggleCronjobModal';
import updateTranslationProgressBar from '../../../actions/translation/updateTranslationProgressBar';
import resetTranslationStore from '../../../actions/translation/resetTranslationStore';


class CronjobModal extends React.Component {

    constructor(props) {
        super(props);
        //this.state = {progress: this.props.TranslationStore.translationProgress.toString()};
    }

    handleCronjobModalClose(){
        this.context.executeAction(toggleCronjobModal);
        this.context.executeAction(resetTranslationStore);    
    }


    //$('#progressbar_cronjobModal_translate').progress('set percent', this.props.TranslationStore.translationProgress);

    initializeProgressBar() {
        $('#progressbar_cronjobModal_translate').progress('set active');
        $('#progressbar_cronjobModal_translate').progress('reset');
        $('#progressbar_cronjobModal_translate').progress({
            text: {
                active  : 'Translating: {percent}%',
                success : 'Slides translated!',
                error   : 'Translation failed!'
            }
        });
    }

    componentDidMount(){
        this.initializeProgressBar();
    }

    componentDidUpdate(){
        $('#progressbar_cronjobModal_translate').progress('set percent', this.props.TranslationStore.translationProgress);
    }

    goToTranslation(){
        this.context.executeAction(navigateAction, {
            url: '/deck/'+ this.props.TranslationStore.newId
        });
        this.handleCronjobModalClose();

    }

    render() {
        let progress = this.props.TranslationStore.translationProgress;

        return (
            <Modal dimmer='blurring' role='dialog' aria-labelledby='cronjobModalHeader' open={this.props.TranslationStore.isCronjobModalOpen}>
                <Header icon='translate' content={'Translation is in progress'} id='cronjobModalHeader'/>
                <Modal.Content>
                    <p> The translation of a deck with more than 20 slides in it takes time.
                    The deck has been added to the queue. You can close this window and will be notified when the job is done.
                    </p>
                    <div className="ui indicating progress" ref="div_progress" id="progressbar_cronjobModal_translate" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" tabIndex="0" >
                        <div className="bar"></div>
                        <div className="label" ref="div_progress_text" id="progresslabel_cronjobModal_translate" aria-live="polite"></div>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.TranslationStore.isCronjobModalOpen}>
                        {progress === 100 ? <Button as='button' primary onClick={this.goToTranslation.bind(this)}>Go to translation</Button> : ''}
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
