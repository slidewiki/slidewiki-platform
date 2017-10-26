import React from 'react';
import FocusTrap from 'focus-trap-react';

import {connectToStores} from 'fluxible-addons-react';
import ISO6391 from 'iso-639-1';
import {navigateAction} from 'fluxible-router';
import translateDeckRevision from '../../../actions/translateDeckRevision.js';

import {  Dropdown, Button, Modal, Icon, Header, Divider} from 'semantic-ui-react';

import TranslationStore from '../../../stores/TranslationStore';
import UserProfileStore from '../../../stores/UserProfileStore';


class TranslationModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {language: null, error:false};
    }

    handleLanguageClick(id){

        this.context.executeAction(navigateAction, {
            url: '/deck/'+ id
        });
        this.handleClose();
    }

    handleClose(){
        this.setState({language: null, error: false});
        this.props.handleClose();
    }


    handleTranslateToClick(){
        //$(document).find('#deckViewPanel').prepend('<div className="ui active dimmer"><div className="ui text loader">Loading</div></div>');
        let code = this.state.language;
        if (code){
            this.context.executeAction(translateDeckRevision, {
                // TODO this is wrong, the second part for a lanugage code is the COUNTRY not the language, so for greek the el_EL is invalid
                language: code+'_'+code.toUpperCase()
            });
            this.handleClose();
        }else{
            this.setState({error: true});
        }
    }

    renderAvailable(translation) {
        let languageName = ISO6391.getName(translation.language.toLowerCase().substr(0,2));
        if (languageName){
            if (translation.language !== this.props.TranslationStore.currentLang.language){
                return (
                    <a href='' key={translation.language} onClick={ this.handleLanguageClick.bind(this, translation.deck_id) }>{languageName}</a>
                );
            }else{
                return (
                    <b>{languageName}</b>
                );
            }
        }else{
            return null;
        }
    }

    handleOptionChange(event, data) {
        this.setState({language: data.value, error: false});
    }

    renderTranslateTo(supported) {
        return (
            {value:supported.code , text: supported.name}
        );
    }

    render() {

        const deckLanguage = this.props.TranslationStore.currentLang.language;
        let translations = [];
        let existing_codes = [];
        let languages_string = '';
        let languages_array = [];
        if (this.props.TranslationStore.translations){
            translations = this.props.TranslationStore.translations;
            existing_codes = this.props.TranslationStore.translations.map((el) => { //getting all translations codes
                return el.language.split('_')[0];
            });
        }
        let available_desc = '';
        let available_array = [];
        available_array = translations.map((translation) => {
            let languageName = ISO6391.getName(translation.language.toLowerCase().substr(0,2));
            if (languageName){
                if (translation.language !== this.props.TranslationStore.currentLang.language){
                    let link = '/deck/';
                    link+= translation.deck_id;
                    return (
                        <a href={link}>{languageName}, </a>
                    );
                }
            }else{
                return null;
            }
        });
        if (available_array.length){
            let current = ISO6391.getName(deckLanguage.toLowerCase().substr(0,2));
            available_desc = <p>This deck is already available in {available_array} and <b>{current}</b>.</p>;
        }

        const supported = this.props.TranslationStore.supportedLangs.filter((el) => { //removing existing translations from supported
            return !existing_codes.includes(el.code);
        });

        let currentLang = ISO6391.getName(deckLanguage.toLowerCase().substr(0,2));

        let languageOptions = supported.map(this.renderTranslateTo, this);

        return (
        <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='translationModalHeader'
               aria-describedby='translationModalDesc' open={this.props.isOpen}
               onClose={this.props.handleClose}>
            <Header icon='translate' content='Translate the deck' id='translationModalHeader'/>
            <Modal.Content>
                <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.isOpen}>
                    {available_desc}
                    <p>You are about to translate the deck, please, choose the target language from the list below:</p>
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
                    <Divider/>
                    <p>
                        <Button as='button' primary onClick={this.handleTranslateToClick.bind(this)}><Icon name='translate'/> Translate</Button>
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
TranslationModal = connectToStores(TranslationModal, [TranslationStore, UserProfileStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default TranslationModal;
