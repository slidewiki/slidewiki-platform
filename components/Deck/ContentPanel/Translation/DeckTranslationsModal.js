import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import FocusTrap from 'focus-trap-react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Button, Modal, Divider, TextArea, Dropdown, Segment} from 'semantic-ui-react';
import TranslationStore from '../../../../stores/TranslationStore';
import {getLanguageName, getLanguageNativeName} from '../../../../configs/general.js';
import {navigateAction} from 'fluxible-router';
import addDeckTranslation from '../../../../actions/translation/addDeckTranslation';
import changeCurrentLanguage from '../../../../actions/translation/changeCurrentLanguage';
import loadDecktreeAndSwitchLanguage from '../../../../actions/translation/loadDecktreeAndSwitchLanguage';

class DeckTranslationsModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            activeTrap: false,
            action: '',
            languageCode: ''
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
    }

    handleOpen(){
        $('#app').attr('aria-hidden','true');
        this.setState({
            modalOpen:true,
            activeTrap:true,
            action: '',
            languageCode: ''
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

    handleTranslationSelection(e, data) {
        this.setState({ action: 'languageselect', languageCode: data.value });
    }

    handleLanguageSelection(e, data) {
        this.setState({ action: 'translate', languageCode: data.value });
    }

    handleSwitchBackClick(e) {
        this.handleClose();
        this.redirectToLanguage('');
    }

    handleActionClick(e) {
        if (this.state.action === 'languageselect') {
            this.handleClose();

            this.redirectToLanguage(this.state.languageCode);
        }
        else if (this.state.action === 'translate') {
            this.handleClose();

            this.context.executeAction(addDeckTranslation, {
                language: this.state.languageCode
            });
        }
    }

    redirectToLanguage(language = '') {
        console.log('redirectToLanguage language', language);
        this.context.executeAction(changeCurrentLanguage, {language: language || this.props.TranslationStore.originLanguage});
        this.context.executeAction(loadDecktreeAndSwitchLanguage, {
            language: language
        });
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
            translate: {
                id: 'DeckTranslationsModal.translate',
                defaultMessage: 'Create translation',
            },
            language: {
                id: 'DeckTranslationsModal.language',
                defaultMessage: 'Switch to language',
            },
            switchBack: {
                id: 'DeckTranslationsModal.switchBack',
                defaultMessage: 'Switch to origin language:',
            },
        });

        let message = this.props.TranslationStore.inTranslationMode ? messages.currentTranslation : messages.currentLanguage;

        let translationOptions = [];
        if (this.props.TranslationStore.translations && this.props.TranslationStore.translations.length > 0) {
            translationOptions = this.props.TranslationStore.translations.reduce((arr, current)  => {
                if (getLanguageNativeName(current.replace('_', '-'))  !== getLanguageNativeName(this.props.TranslationStore.originLanguage)
                    && getLanguageNativeName(current.replace('_', '-'))  !== getLanguageNativeName(this.props.TranslationStore.currentLang))
                    arr.push({key: current, value: current, text: getLanguageNativeName(current)});
                return arr;
            }, []).sort((a, b) => a.text > b.text);
        }

        let languagesOptions = [];
        if (this.props.TranslationStore.supportedLangs && this.props.TranslationStore.supportedLangs.length > 0) {
            languagesOptions = this.props.TranslationStore.supportedLangs.reduce((arr, current)  => {
                if (!this.props.TranslationStore.translations.find((t) => getLanguageNativeName(t.replace('_', '-') ) === getLanguageNativeName(current.replace('_', '-') )) //exclude transations and deck language
                  && getLanguageNativeName(current.replace('_', '-')) !== getLanguageNativeName(this.props.TranslationStore.treeLanguage)
                  && getLanguageNativeName(current.replace('_', '-')) !== getLanguageNativeName(this.props.TranslationStore.originLanguage))
                    arr.push({key: current, value: current, text: getLanguageNativeName(current)});
                return arr;
            }, []).sort((a, b) => a.text > b.text);
        }

        let btnMessage = '<------>';
        if (this.state.action === 'languageselect')
            btnMessage = this.context.intl.formatMessage(messages.language);
        else if (this.state.action === 'translate')
            btnMessage = this.context.intl.formatMessage(messages.translate);

        const language = getLanguageNativeName(this.props.TranslationStore.inTranslationMode ? (this.props.TranslationStore.currentLang || this.props.TranslationStore.originLanguage) : this.props.TranslationStore.treeLanguage);

        let origin = this.props.TranslationStore.inTranslationMode ? <div>
            {this.context.intl.formatMessage(messages.switchBack)} <br/> <Button onClick={this.handleSwitchBackClick.bind(this)} basic>{getLanguageNativeName(this.props.TranslationStore.originLanguage || this.props.TranslationStore.nodeLanguage)}</Button>
            <br/>
            <br/>
            </div>
          : '';

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
                      {this.context.intl.formatMessage(message)} <Segment compact>{language}</Segment>
                      <br/>

                      {origin}

                      {this.context.intl.formatMessage(messages.switch)}
                      <br/>
                      <Dropdown
                          placeholder={this.context.intl.formatMessage(messages.chooseTranslation)}
                          fluid
                          scrolling
                          selection
                          search
                          options={translationOptions}
                          onChange={this.handleTranslationSelection.bind(this)}
                          id="DeckTranslationsModalTranslationsDropdown"
                          name='translationSelection'
                        />
                      <br/>
                      <br/>

                      {this.context.intl.formatMessage(messages.startTranslation)}
                      <br/>
                      <Dropdown
                          placeholder={this.context.intl.formatMessage(messages.chooseLanguage)}
                          fluid
                          scrolling
                          selection
                          search
                          options={languagesOptions}
                          onChange={this.handleLanguageSelection.bind(this)}
                          name='languageSelection'
                        />
                      <Divider />
                      <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                        <Button id="DeckTranslationsModalActionButton" color="green" tabIndex="0" type="button" aria-label={btnMessage} onClick={this.handleActionClick.bind(this)} icon="save" labelPosition='left' content={btnMessage}/>
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
