import React from 'react';
import PropTypes from 'prop-types';
import {connectToStores} from 'fluxible-addons-react';
import FocusTrap from 'focus-trap-react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Button, Modal, Divider, TextArea, Dropdown, Segment} from 'semantic-ui-react';
import TranslationStore from '../../../../stores/TranslationStore';
import {getLanguageNativeName, compareLanguageCodes} from '../../../../common';
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

    handleTranslationSelection(code, e) {
        this.handleClose();
        this.redirectToLanguage(code);
    }

    handleLanguageSelection(e, data) {
        this.setState({ action: 'translate', languageCode: data.value });
    }

    handleActionClick(e) {
        if (this.state.action === 'translate') {
            this.handleClose();

            this.context.executeAction(addDeckTranslation, {
                language: this.state.languageCode
            });
        }
    }

    redirectToLanguage(language = '') {
        // console.log('redirectToLanguage language', language);
        this.context.executeAction(loadDecktreeAndSwitchLanguage, {
            language: language
        });
    }

    render() {
        const messages = defineMessages({
            header: {
                id: 'DeckTranslationsModal.header',
                defaultMessage: 'Start new deck translations',
            },
            chooseLanguage: {
                id: 'DeckTranslationsModal.chooseLanguage',
                defaultMessage: 'Choose the target language...',
            },
            startTranslation: {
                id: 'DeckTranslationsModal.startTranslation',
                defaultMessage: 'Create a new translation:',
            },
            startTranslationSearchOptions: {
                id: 'DeckTranslationsModal.startTranslationSearchOptions',
                defaultMessage: ' (start typing to find your language in its native name)',
            },
            cancel: {
                id: 'DeckTranslationsModal.cancel',
                defaultMessage: 'Cancel',
            },
            translate: {
                id: 'DeckTranslationsModal.translate',
                defaultMessage: 'Create translation',
            },
            originLanguage: {
                id: 'DeckTranslationsModal.originLanguage',
                defaultMessage: 'Original Language:',
            },
            switchSR: {
                id: 'DeckTranslationsModal.switchSR',
                defaultMessage: 'Create a new deck translation',
            }
        });

        let languagesOptions = [];
        if (this.props.TranslationStore.supportedLangs && this.props.TranslationStore.supportedLangs.length > 0) {
            languagesOptions = this.props.TranslationStore.supportedLangs.reduce((arr, current)  => {
                if (!this.props.TranslationStore.treeTranslations.find((t) => compareLanguageCodes(t, current)) //exclude transations and deck language
                  && !compareLanguageCodes(current, this.props.TranslationStore.treeLanguage)
                  && !compareLanguageCodes(current, this.props.TranslationStore.originLanguage))
                    arr.push({key: current, value: current, text: getLanguageNativeName(current)});
                return arr;
            }, []).sort((a, b) => (a.text > b.text) ? 1 : -1);
        }

        let btnMessage = this.context.intl.formatMessage(messages.translate);

        const language = getLanguageNativeName(this.props.TranslationStore.inTranslationMode ? (this.props.TranslationStore.currentLang || this.props.TranslationStore.originLanguage) : this.props.TranslationStore.treeLanguage);

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
                      clickOutsideDeactivates: false
                  }}>
                  <Modal.Header className="ui left aligned" as="h1" id="DeckTranslationsModalHeader">
                    {this.context.intl.formatMessage(messages.header)}
                  </Modal.Header>
                  <Modal.Content id="DeckTranslationsModalDescription">
                      <div className="sr-only" id="DeckTranslationsModalDescription2">{this.context.intl.formatMessage(messages.switchSR)}</div>
                      <Divider />

                      <div>
                      {this.context.intl.formatMessage(messages.startTranslation)}
                      <br/>
                      <Dropdown
                          className="ui"
                          placeholder={this.context.intl.formatMessage(messages.chooseLanguage)}
                          search
                          options={languagesOptions}
                          onChange={this.handleLanguageSelection.bind(this)}
                          name='languageSelection'
                        /> {this.context.intl.formatMessage(messages.startTranslationSearchOptions)}
                        </div>
                      <Divider />
                      <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                        <Button id="DeckTranslationsModalActionButton" color="green" tabIndex="0" type="button" aria-label={btnMessage} onClick={this.handleActionClick.bind(this)} content={btnMessage} disabled={this.state.action !== 'translate'} />
                        <Button color='red' tabIndex="0" type="button" aria-label={this.context.intl.formatMessage(messages.cancel)} onClick={this.handleClose} icon="minus circle" labelPosition='left' content={this.context.intl.formatMessage(messages.cancel)} />
                      </Modal.Actions>
                  </Modal.Content>
              </FocusTrap>
          </Modal>
        );
    }
}

DeckTranslationsModal.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};
DeckTranslationsModal = connectToStores(DeckTranslationsModal, [TranslationStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState()
    };
});

export default DeckTranslationsModal;
