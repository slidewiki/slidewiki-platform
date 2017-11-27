import React from 'react';
import FocusTrap from 'focus-trap-react';

import {connectToStores} from 'fluxible-addons-react';
import ISO6391 from 'iso-639-1';
import {navigateAction} from 'fluxible-router';
import translateDeckRevision from '../../../actions/translateDeckRevision.js';
import translateSlideRevision from '../../../actions/translateSlideRevision.js';

import {  Dropdown, Button, Modal, Icon, Header, Divider} from 'semantic-ui-react';

import TranslationStore from '../../../stores/TranslationStore';
import UserProfileStore from '../../../stores/UserProfileStore';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import loadSlidePreview from '../../../actions/slide/loadSlidePreview';
import SlidePreviewModal from './SlidePreviewModal';


class TranslationModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {language: null, error:false, previewModal:false, previewLanguage: null};
    }

    handleLanguageClick(id){

        this.context.executeAction(navigateAction, {
            url: '/deck/'+ id
        });
        this.handleClose();
    }

    handleClose(){
        this.setState({language: null, error: false, previewLanguage: null});
        this.props.handleClose();
    }


    handleTranslateToClick(mode, selector = null){
        //$(document).find('#deckViewPanel').prepend('<div className="ui active dimmer"><div className="ui text loader">Loading</div></div>');
        let code = this.state.language;
        if (code){
            switch (mode){
                case 'deck':
                    this.context.executeAction(translateDeckRevision, {
                        // TODO this is wrong, the second part for a lanugage code is the COUNTRY not the language, so for greek the el_EL is invalid
                        language: code+'_'+code.toUpperCase()
                    });
                    this.props.handleClose();
                    break;
                case 'slide':
                    this.context.executeAction(translateSlideRevision, {
                        // TODO this is wrong, the second part for a lanugage code is the COUNTRY not the language, so for greek the el_EL is invalid
                        language: code+'_'+code.toUpperCase(),
                        selector: selector
                    });
                    this.setState({previewModal: true});
                    break;
                case 'subdeck':
                    this.context.executeAction(translateDeckRevision, {
                        // TODO this is wrong, the second part for a lanugage code is the COUNTRY not the language, so for greek the el_EL is invalid
                        language: code+'_'+code.toUpperCase(),
                        selector: selector
                    });
                    this.props.handleClose();
                    break;                
            }

        }else{
            this.setState({error: true});
        }
    }


    handleOptionChange(event, data) {
        this.setState({language: data.value, error: false});
    }

    renderTranslateTo(supported) {
        return (
            {value:supported.code , key: supported.code, text: supported.name}
        );
    }

    showSlidePreview(id, language){
        this.context.executeAction(loadSlidePreview, {params: {'sid' : id}});
        this.setState({previewModal: true, previewLanguage: language});
    }

    render() {
        let current = '';
        let selector = this.props.selector;
        let mode = this.props.mode;
        if (mode !== 'deck'){ //this is content item modal
            if (this.props.selector.stype === 'deck'){ //a deck is selected
                mode = 'subdeck';
            }else{
                mode = 'slide'; //a slide is selected
            }
        }

        let translations = [];
        let existing_codes = [];
        let languages_string = '';
        let languages_array = [];
        let available_desc = '';
        let available_array = [];

        let languageOptions = [];
        let currentLanguage = 'en_GB';

        switch (mode) {
            case 'deck': //root deck, subdecks
                currentLanguage = this.props.DeckTreeStore.currentLang.language;
                if (currentLanguage){
                    current = ISO6391.getName(currentLanguage.toLowerCase().substr(0,2));
                }else{
                    current = '';
                }
                translations = this.props.DeckTreeStore.translations; //for the root deck
                break;
            case 'slide': //slide, subdeck
                currentLanguage = this.props.TranslationStore.currentLang.language;
                if (currentLanguage){
                    current = ISO6391.getName(currentLanguage.toLowerCase().substr(0,2));
                }else{
                    current = '';
                }
                translations = this.props.TranslationStore.translations;
                break;
            case 'subdeck': //slide, subdeck
                currentLanguage = this.props.TranslationStore.currentLang.language;
                if (currentLanguage){
                    current = ISO6391.getName(currentLanguage.toLowerCase().substr(0,2));
                }else{
                    current = '';
                }
                translations = this.props.TranslationStore.translations;
                break;
            default:
                currentLanguage = this.props.DeckTreeStore.currentLang.language;
                if (currentLanguage){
                    current = ISO6391.getName(currentLanguage.toLowerCase().substr(0,2));
                }else{
                    current = '';
                }
                translations = this.props.DeckTreeStore.translations; //for the root deck
                break;
        }

        if (translations){
            existing_codes = translations.map((el) => { //getting all translations codes
                return el.language.split('_')[0];
            });

            available_array = translations.map((translation) => {
                let languageName = ISO6391.getName(translation.language.toLowerCase().substr(0,2));
                let link = '/deck/';
                if (languageName){
                    if (translation.language !== currentLanguage){
                        switch (mode){
                            case 'deck':
                                link+= translation.deck_id;
                                return (
                                    <a href={link} key={languageName}>{languageName}, </a>
                                );
                                break;
                            case 'slide':
                                return (
                                    <a as='a' onClick={ this.showSlidePreview.bind(this, translation.slide_id, languageName) } key ={languageName}>{languageName}, </a>
                                );
                                break;
                            case 'subdeck':
                                link+= translation.deck_id;
                                return (
                                    <a href={link} key={languageName}>{languageName}, </a>
                                );
                                break;
                            default: //subdeck
                                link+= translation.deck_id;
                                return (
                                    <a href={link} key={languageName}>{languageName}, </a>
                                );
                                break;
                        }
                    }
                }else{
                    return null;
                }
            });
            if (currentLanguage){
                available_desc = <p>This {mode} is already available in {available_array} and <b>{current}</b>.</p>;
            }
        }



        const supported = this.props.TranslationStore.supportedLangs.filter((el) => { //removing existing translations from supported
            return !existing_codes.includes(el.code);
        });


        if (supported){
            languageOptions = supported.map(this.renderTranslateTo, this);

        }


        return (

        <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='translationModalHeader'
               aria-describedby='translationModalDesc' open={this.props.isOpen}
               onClose={this.props.handleClose}>
               <SlidePreviewModal languageName={this.state.previewLanguage} slide={this.props.TranslationStore.slideToPreview} isOpen={this.state.previewModal} handleClose={() => this.setState({previewModal: false})} />
            <Header icon='translate' content={'Translate the ' +mode} id='translationModalHeader'/>
            <Modal.Content>
                <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.isOpen}>
                    {available_desc}
                    <p id='translationModalDesc'>You are about to translate the {mode}. Please choose the target language from the list below:</p>
                    <Dropdown
                        placeholder='Choose a target language...'
                        scrolling
                        selection
                        search
                        className={this.state.error ? 'error' : ''}
                        options={languageOptions}
                        onChange={this.handleOptionChange.bind(this)}
                        ref = {(dropDown) => {this.dropDown = dropDown;}}
                        value = {this.state.language}
                      />
                      <p><b>!Please note that this is an experimental service! <br/> We use Microsoft Bing translation service, which may not be accurate.</b></p>
                    <Divider/>
                    <p>
                        <Button as='button' primary onClick={this.handleTranslateToClick.bind(this, mode, this.props.selector)}><Icon name='translate'/> Translate</Button>
                        <Button as='button' onClick={this.handleClose.bind(this)}><Icon name='close'/> Close</Button>
                    </p>
                </FocusTrap>
            </Modal.Content>
        </Modal>
        );
    }
}

TranslationModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
TranslationModal = connectToStores(TranslationModal, [TranslationStore, UserProfileStore, DeckTreeStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
    };
});

export default TranslationModal;
