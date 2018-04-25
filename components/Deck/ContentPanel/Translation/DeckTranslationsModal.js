import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import FocusTrap from 'focus-trap-react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Button, Modal, Divider, TextArea,Dropdown} from 'semantic-ui-react';
import TranslationStore from '../../../../stores/TranslationStore';
import ISO6391 from 'iso-639-1';

class DeckTranslationsModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            activeTrap: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
    }

    handleOpen(){
        $('#app').attr('aria-hidden','true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });
    }

    handleClose(){
        $('#app').attr('aria-hidden','false');
        this.setState({
            modalOpen:false,
            activeTrap: false
        });
    }

    unmountTrap(){
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    handleTranslationSelection() {

    }

    handleLanguageSelection() {

    }

    render() {
        const messages = defineMessages({
            header: {
                id: 'DeckTranslationsModal.header',
                defaultMessage: 'Translation selection',
            },
            currentLanguage: {
                id: 'DeckTranslationsModal.currentLanguage',
                defaultMessage: 'This deck has the following language:',
            },
            currentTranslation: {
                id: 'DeckTranslationsModal.currentTranslation',
                defaultMessage: 'This is a translation of the deck in the following language:',
            },
            switch: {
                id: 'DeckTranslationsModal.switch',
                defaultMessage: 'Select a translation to switch to it:',
            },
            chooseTranslation: {
                id: 'DeckTranslationsModal.chooseTranslation',
                defaultMessage: 'Choose a translation...',
            },
            chooseLanguage: {
                id: 'DeckTranslationsModal.chooseLanguage',
                defaultMessage: 'Choose the target language...',
            },
            startTranslation: {
                id: 'DeckTranslationsModal.startTranslation',
                defaultMessage: 'Or you can start a translation - just select the target language:',
            },
            cancel: {
                id: 'DeckTranslationsModal.cancel',
                defaultMessage: 'Cancel',
            },
            save: {
                id: 'DeckTranslationsModal.save',
                defaultMessage: 'Save',
            },
        });

        let message = this.props.TranslationStore.translations.find((t) => {return t === this.props.TranslationStore.treeLanguage}) ? messages.currentTranslation : messages.currentLanguage;

        let translationOptions = [];
        if (this.props.TranslationStore.translations && this.props.TranslationStore.translations.length > 0) {
            translationOptions = this.props.TranslationStore.translations.reduce((arr, current)  => {
                arr.push({key: current, value: current, text: ISO6391.getNativeName(current)});
                return arr;
            }, []);
        }

        let languagesOptions = [];
        if (this.props.TranslationStore.supportedLangs && this.props.TranslationStore.supportedLangs.length > 0) {
            languagesOptions = this.props.TranslationStore.supportedLangs.reduce((arr, current)  => {
                arr.push({key: current, value: current, text: ISO6391.getNativeName(current)});
                return arr;
            }, []);
        }

        return (
          <Modal trigger={
                  <Button tabIndex='-1' id="DeckTranslationsModalOpenButton" aria-hidden={this.state.modalOpen} basic onClick={this.handleOpen} style={{'display': 'none'}}/>
                 }
              open={this.state.modalOpen}
              onClose={this.handleClose}
              size="small"
              role="dialog"
              id="DeckTranslationsModal"
              aria-labelledby="DeckTranslationsModalHeader"
              aria-describedby="DeckTranslationsModalDescription"
              tabIndex="0">
              <FocusTrap
                  id='focus-trap-DeckTranslationsModal'
                  className = "header"
                  active={this.state.activeTrap}
                  focusTrapOptions={{
                      onDeactivate: this.unmountTrap,
                      clickOutsideDeactivates: false,
                      initialFocus: '#DeckTranslationsModalTranslationsDropdown',
                  }}>
                  <Modal.Header className="ui left aligned" as="h1" id="DeckTranslationsModalHeader">
                    {this.context.intl.formatMessage(messages.header)}
                  </Modal.Header>
                  <Modal.Content id="DeckTranslationsModalDescription">
                      <Divider />
                      {this.context.intl.formatMessage(message)} {ISO6391.getNativeName(this.props.TranslationStore.treeLanguage)}
                      <br/>

                      {this.context.intl.formatMessage(messages.switch)}
                      <br/>
                      <Dropdown
                          placeholder={this.context.intl.formatMessage(messages.chooseTranslation)}
                          scrolling
                          selection
                          search
                          options={translationOptions}
                          onChange={this.handleTranslationSelection.bind(this)}
                          id="DeckTranslationsModalTranslationsDropdown"
                        />
                      <br/>
                      <br/>

                      {this.context.intl.formatMessage(messages.startTranslation)}
                      <br/>
                      <Dropdown
                          placeholder={this.context.intl.formatMessage(messages.chooseLanguage)}
                          scrolling
                          selection
                          search
                          options={languagesOptions}
                          onChange={this.handleLanguageSelection.bind(this)}
                        />
                      <Divider />
                      <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                        <Button color='red' tabIndex="0" type="button" aria-label={this.context.intl.formatMessage(messages.cancel)} onClick={this.handleClose} icon="minus circle" labelPosition='left' content={this.context.intl.formatMessage(messages.cancel)}/>
                      </Modal.Actions>
                  </Modal.Content>
              </FocusTrap>
          </Modal>
        );
    }
}

DeckTranslationsModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};
DeckTranslationsModal = connectToStores(DeckTranslationsModal, [TranslationStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState()
    };
});

export default DeckTranslationsModal;
