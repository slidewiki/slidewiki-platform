import React from 'react';
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

    handleSwitchBackClick(e) {
        this.handleClose();
        this.redirectToLanguage('');
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
        this.context.executeAction(changeCurrentLanguage, {language: language});
        this.context.executeAction(loadDecktreeAndSwitchLanguage, {
            language: language
        });
    }

    render() {
        const messages = defineMessages({
            header: {
                id: 'DeckTranslationsModal.header',
                defaultMessage: 'Select translation',
            },
            currentLanguage: {
                id: 'DeckTranslationsModal.currentLanguage',
                defaultMessage: 'Current Language:',
            },
            otherTranslations: {
                id: 'DeckTranslationsModal.otherTranslations',
                defaultMessage: 'Other translations available:',
            },
            chooseLanguage: {
                id: 'DeckTranslationsModal.chooseLanguage',
                defaultMessage: 'Choose the target language...',
            },
            startTranslation: {
                id: 'DeckTranslationsModal.startTranslation',
                defaultMessage: 'Create new translation:',
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
            originLanguage: {
                id: 'DeckTranslationsModal.originLanguage',
                defaultMessage: 'Original Language:',
            },
            switchSR: {
                id: 'DeckTranslationsModal.switchSR',
                defaultMessage: 'Switch to another language or create a new translation',
            },
            primaryLanguage: {
                id: 'DeckTranslationsModal.primaryLanguage',
                defaultMessage: 'Primary language',
            }
        });

        let translations0 = [];
        if (this.props.TranslationStore.translations && this.props.TranslationStore.translations.length > 0) {
            translations0 = this.props.TranslationStore.translations.reduce((ac, current)  => {
                if (!compareLanguageCodes(current, this.props.TranslationStore.originLanguage)
                    && !compareLanguageCodes(current, this.props.TranslationStore.currentLang))
                    ac.push(current);
                return ac;
            }, []).sort((a, b) => a > b);
        }
        let translations = translations0.reduce( (ac, current) => {
            ac.push(<Button key={'btnkey_languagecode_' + current} role="button" tabIndex="0" onClick={this.handleTranslationSelection.bind(this, current)} basic>{getLanguageNativeName(current)}</Button>);
            return ac;
        }, []);

        let languagesOptions = [];
        if (this.props.TranslationStore.supportedLangs && this.props.TranslationStore.supportedLangs.length > 0) {
            languagesOptions = this.props.TranslationStore.supportedLangs.reduce((arr, current)  => {
                if (!this.props.TranslationStore.translations.find((t) => compareLanguageCodes(t, current)) //exclude transations and deck language
                  && !compareLanguageCodes(current, this.props.TranslationStore.treeLanguage)
                  && !compareLanguageCodes(current, this.props.TranslationStore.originLanguage))
                    arr.push({key: current, value: current, text: getLanguageNativeName(current)});
                return arr;
            }, []).sort((a, b) => a.text > b.text);
        }

        let btnMessage = this.context.intl.formatMessage(messages.translate);

        const language = getLanguageNativeName(this.props.TranslationStore.inTranslationMode ? (this.props.TranslationStore.currentLang || this.props.TranslationStore.originLanguage) : this.props.TranslationStore.treeLanguage);

        const showCreateTranslation = this.props.username !== '' && this.props.editPermissions;

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
                      {this.context.intl.formatMessage(messages.currentLanguage)} <b>{language}</b>
                      <br/>
                      <br/>

                      <div>
                        {this.context.intl.formatMessage(messages.originLanguage)} <Button role="button" tabIndex="0" onClick={this.handleSwitchBackClick.bind(this)} basic>{getLanguageNativeName(this.props.TranslationStore.originLanguage || this.context.intl.formatMessage(messages.primaryLanguage))}</Button>
                        <br/>
                      </div>
                      <br/>

                      {this.context.intl.formatMessage(messages.otherTranslations)}
                      <br/>
                      {translations}
                      <br/>
                      <br/>

                      {showCreateTranslation ? <div>
                      {this.context.intl.formatMessage(messages.startTranslation)}
                      <br/>
                      <Dropdown
                          className="ui"
                          placeholder={this.context.intl.formatMessage(messages.chooseLanguage)}
                          search
                          options={languagesOptions}
                          onChange={this.handleLanguageSelection.bind(this)}
                          name='languageSelection'
                        />
                        </div> : ''}
                      <Divider />
                      <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                        {showCreateTranslation ? <Button id="DeckTranslationsModalActionButton" color="green" tabIndex="0" type="button" aria-label={btnMessage} onClick={this.handleActionClick.bind(this)} content={btnMessage} disabled={this.state.action !== 'translate'} /> : ''}
                        <Button color='red' tabIndex="0" type="button" aria-label={this.context.intl.formatMessage(messages.cancel)} onClick={this.handleClose} icon="minus circle" labelPosition='left' content={this.context.intl.formatMessage(messages.cancel)} />
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
