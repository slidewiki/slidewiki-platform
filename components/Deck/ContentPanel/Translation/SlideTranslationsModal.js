import React from 'react';
import PropTypes from 'prop-types';
import {connectToStores} from 'fluxible-addons-react';
import FocusTrap from 'focus-trap-react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Button, Modal, Divider, TextArea, Dropdown, Segment} from 'semantic-ui-react';
import TranslationStore from '../../../../stores/TranslationStore';
import {getLanguageDisplayName, compareLanguageCodes} from '../../../../common';
import {navigateAction} from 'fluxible-router';
import addNodeTranslation from '../../../../actions/translation/addNodeTranslation';
import { makeNodeURL } from '../../../common/Util';
import ContentStore from '../../../../stores/ContentStore';
import DeckPageStore from '../../../../stores/DeckPageStore';


class SlideTranslationsModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            activeTrap: false,
            action: '',
            sourceLanguageCode: '',
            targetLanguageCode: ''
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

    handleSourceLanguageSelection(e, data) {
        this.setState({ action: 'translate', sourceLanguageCode: data.value });
    }
    handleTargetLanguageSelection(e, data) {
        this.setState({ action: 'translate', targetLanguageCode: data.value });
    }

    handleActionClick(e) {
        if (this.state.action === 'translate') {
            //$('#PresentationNewWindow').click();
            console.log('test');
            this.handleClose();

            //let primaryLanguage = this.props.TranslationStore.treeLanguage;
            //let selectedLanguage = this.props.TranslationStore.currentLang || primaryLanguage;

            //this.context.executeAction(addNodeTranslation, {
            //    language: this.state.languageCode
            //});
        }
    }

    render() {
        const messages = defineMessages({
            header: {
                id: 'SlideTranslationsModal.header',
                defaultMessage: 'Translate Slide',
            },
            chooseSourceLanguage: {
                id: 'SlideTranslationsModal.chooseSourceLanguage',
                defaultMessage: 'Choose the source language...',
            },
            chooseTargetLanguage: {
                id: 'SlideTranslationsModal.chooseTargetLanguage',
                defaultMessage: 'Choose the target language...',
            },
            sourceTranslation: {
                id: 'SlideTranslationsModal.sourceTranslation',
                defaultMessage: 'Source (current) language of slide:',
            },
            targetTranslation: {
                id: 'SlideTranslationsModal.targetTranslation',
                defaultMessage: 'Target language of slide (translate to):',
            },
            autoSelect: {
                id: 'SlideTranslationsModal.autoSelect',
                defaultMessage: 'The source and target language of this translation are automatically selected. Only select a different language if this automatic selection is incorrect.',
            },
            alternativeTranslation1: {
                id: 'SlideTranslationsModal.alternativeTranslation1',
                defaultMessage: 'We have a limit amount of automatic translation each month. Alternatively, you can use the ',
            },
            alternativeTranslation2: {
                id: 'SlideTranslationsModal.alternativeTranslation2',
                defaultMessage: ' built-in translation feature, ',
            },
            alternativeTranslation3: {
                id: 'SlideTranslationsModal.alternativeTranslation3',
                defaultMessage: ' translation extension or “app”, and via one of the Mozilla Firefox extensions for translations (',
            },
            openOriginal: {
                id: 'SlideTranslationsModal.openOriginal',
                defaultMessage: 'With the play button below you can open the original untranslated version of this slide in a new window. This can help you to evaluate the automatic translation. This button is also always available in the footer below the slide edit area.',
            },
            sourceLanguageSearchOptions: {
                id: 'SlideTranslationsModal.sourceLanguageSearchOptions',
                defaultMessage: ' (start typing to find the source language)',
            },
            targetLanguageSearchOptions: {
                id: 'SlideTranslationsModal.targetLanguageSearchOptions',
                defaultMessage: ' (start typing to find the target language)',
            },
            cancel: {
                id: 'SlideTranslationsModal.cancel',
                defaultMessage: 'Cancel',
            },
            translate: {
                id: 'SlideTranslationsModal.translate',
                defaultMessage: 'Start translation',
            },
            originLanguage: {
                id: 'SlideTranslationsModal.originLanguage',
                defaultMessage: 'Original Language:',
            },
            switchSR: {
                id: 'SlideTranslationsModal.switchSR',
                defaultMessage: 'Start a new slide translation',
            }
        });

        let primaryLanguage = this.props.TranslationStore.treeLanguage;
        let selectedLanguage = this.props.TranslationStore.currentLang || primaryLanguage;
        let sourceLanguagesOptions = [];
        if (this.props.TranslationStore.supportedLangs && this.props.TranslationStore.supportedLangs.length > 0) {
            sourceLanguagesOptions = this.props.TranslationStore.supportedLangs.reduce((arr, current)  => {
                if (this.props.TranslationStore.treeTranslations.find((t) => compareLanguageCodes(t, current)) //include only tranlations and original deck language
                  || compareLanguageCodes(current, this.props.TranslationStore.treeLanguage))
                    arr.push({key: current, value: current, text:  (current === primaryLanguage  ? ' ' : '') + getLanguageDisplayName(current) + (current === primaryLanguage ? ' (primary)' : '')});
                return arr;
            }, []).sort((a, b) => (a.text > b.text) ? 1 : -1);
        }
        let targetLanguagesOptions = [];
        if (this.props.TranslationStore.supportedLangs && this.props.TranslationStore.supportedLangs.length > 0) {
            targetLanguagesOptions = this.props.TranslationStore.supportedLangs.reduce((arr, current)  => {
                if (this.props.TranslationStore.treeTranslations.find((t) => compareLanguageCodes(t, current)) //include only tranlations and original deck language
                  || compareLanguageCodes(current, this.props.TranslationStore.treeLanguage))
                    arr.push({key: current, value: current, text:  (current === selectedLanguage  ? ' ' : '') + getLanguageDisplayName(current) + (current === selectedLanguage ? ' (current)' : '')});
                return arr;
            }, []).sort((a, b) => (a.text > b.text) ? 1 : -1);
        }

        let btnMessage = this.context.intl.formatMessage(messages.translate);

        return (
          <Modal trigger={
                  <Button tabIndex='-1' id="SlideTranslationsModalOpenButton" aria-hidden={this.state.modalOpen} basic onClick={this.handleOpen} style={{'display': 'none'}}/>
                 }
              open={this.state.modalOpen}
              onClose={this.handleClose}
              size="small"
              role="dialog"
              id="SlideTranslationsModal"
              aria-labelledby="SlideTranslationsModalHeader"
              aria-describedby="SlideTranslationsModalDescription"
              tabIndex="0">
              <FocusTrap
                  id='focus-trap-SlideTranslationsModal'
                  className = "header"
                  active={this.state.activeTrap}
                  focusTrapOptions={{
                      onDeactivate: this.unmountTrap,
                      clickOutsideDeactivates: false
                  }}>
                  <Modal.Header className="ui left aligned" as="h1" id="SlideTranslationsModalHeader">
                    {this.context.intl.formatMessage(messages.header)}
                    <br/>
                  </Modal.Header>
                  <Modal.Content id="SlideTranslationsModalDescription">
                      <div className="sr-only" id="SlideTranslationsModalDescription2">{this.context.intl.formatMessage(messages.switchSR)}</div>
                      {this.context.intl.formatMessage(messages.autoSelect)}
                      <Divider />

                      <div>
                      {this.context.intl.formatMessage(messages.sourceTranslation)}
                      <br/>
                      <Dropdown
                          className="ui"
                          placeholder={this.context.intl.formatMessage(messages.chooseSourceLanguage)}
                          search
                          options={sourceLanguagesOptions}
                          onChange={this.handleSourceLanguageSelection.bind(this)}
                          name='sourceLanguageSelection'
                        /> {this.context.intl.formatMessage(messages.sourceLanguageSearchOptions)}
                        </div>
                      <Divider />

                      <div>
                      {this.context.intl.formatMessage(messages.targetTranslation)}
                      <br/>
                      <Dropdown
                          className="ui"
                          placeholder={this.context.intl.formatMessage(messages.chooseTargetLanguage)}
                          search
                          options={targetLanguagesOptions}
                          onChange={this.handleTargetLanguageSelection.bind(this)}
                          name='targetLanguageSelection'
                        /> {this.context.intl.formatMessage(messages.targetLanguageSearchOptions)}
                        </div>
                      <Divider />
                      <br/>
                      {this.context.intl.formatMessage(messages.alternativeTranslation1)}
                      <a href="https://tinyurl.com/ychtmdy9" target="_blank">Google Chrome</a>
                      {this.context.intl.formatMessage(messages.alternativeTranslation2)}
                      <a href="https://tinyurl.com/ycdhg9db"  target="_blank">Microsoft Edge</a>
                      {this.context.intl.formatMessage(messages.alternativeTranslation3)}
                      <a href="https://tinyurl.com/y88t4jtq"  target="_blank">example</a> ).
                      <br/>
                      <br/>
                      {this.context.intl.formatMessage(messages.openOriginal)}
                      <br/>
                      <a id="PresentationNewWindow" href={makeNodeURL(this.props.ContentStore.selector, 'presentation', undefined, this.props.DeckPageStore.deckSlug, this.props.TranslationStore.currentLang)} target="_blank" tabIndex="-1">
                          <button className="ui button" type="button" aria-label="Open slideshow in new tab" data-tooltip="Open slideshow in new tab">
                              <i className="circle play large icon"></i>
                          </button>
                      </a>
                      <br/>

                      <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                        <Button id="SlideTranslationsModalActionButton" color="green" tabIndex="0" type="button" aria-label={btnMessage} onClick={this.handleActionClick.bind(this)} content={btnMessage} disabled={this.state.action !== 'translate'} />
                        <Button color='red' tabIndex="0" type="button" aria-label={this.context.intl.formatMessage(messages.cancel)} onClick={this.handleClose} icon="minus circle" labelPosition='left' content={this.context.intl.formatMessage(messages.cancel)} />
                      </Modal.Actions>
                  </Modal.Content>
              </FocusTrap>
          </Modal>
        );
    }
}

SlideTranslationsModal.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};
SlideTranslationsModal = connectToStores(SlideTranslationsModal, [TranslationStore, ContentStore, DeckPageStore ], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState(),
        ContentStore: context.getStore(ContentStore).getState(),
        DeckPageStore: context.getStore(DeckPageStore).getState(),
    };
});

export default SlideTranslationsModal;
