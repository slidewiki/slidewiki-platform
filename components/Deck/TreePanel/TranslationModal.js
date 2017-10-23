import React from 'react';
import forkDeck from '../../../actions/decktree/forkDeck';
import FocusTrap from 'focus-trap-react';
import _ from 'lodash';

import {connectToStores} from 'fluxible-addons-react';
import ISO6391 from 'iso-639-1';
import {navigateAction} from 'fluxible-router';
import translateDeckRevision from '../../../actions/translateDeckRevision.js';

import { Grid, Dropdown, Divider, Menu, Flag, Button, Modal, Popup, Icon, Header } from 'semantic-ui-react';

import TranslationStore from '../../../stores/TranslationStore';
import UserProfileStore from '../../../stores/UserProfileStore';


class TranslationModal extends React.Component {

    constructor(props) {
        super(props);
    }

    handleLanguageClick(id){

        this.context.executeAction(navigateAction, {
            url: '/deck/'+ id
        });
        this.props.handleClose();
    }


    handleTranslateToClick(code){
        //$(document).find('#deckViewPanel').prepend('<div className="ui active dimmer"><div className="ui text loader">Loading</div></div>');
        this.context.executeAction(translateDeckRevision, {
            // TODO this is wrong, the second part for a lanugage code is the COUNTRY not the language, so for greek the el_EL is invalid
            language: code+'_'+code.toUpperCase()
        });
        this.props.handleClose();
    }

    renderAvailable(translation) {
        if (translation.language !== this.props.TranslationStore.currentLang.language){
            let languageName = ISO6391.getName(translation.language.toLowerCase().substr(0,2));
            if (languageName){
                return (
                    <Button basic
                    key = {translation.language}
                    onClick={ this.handleLanguageClick.bind(this, translation.deck_id) }
                    //href={''}
                    >
                    <font color='blue'>{languageName}</font>
                    </Button>
                );
            }
        }
    }

    renderTranslateTo(supported) {

        return (
            <Button basic
            onClick = {this.handleTranslateToClick.bind(this, supported.code)}>
            {supported.name}
            </Button>
        );

    }

    render() {

        const deckLanguage = this.props.TranslationStore.currentLang.language;
        let translations = [];
        let existing_codes = [];
        if (this.props.TranslationStore.translations){
            translations = this.props.TranslationStore.translations;
            existing_codes = this.props.TranslationStore.translations.map((el) => {
                return el.language.split('_')[0];
            });
        }
        const supported = this.props.TranslationStore.supportedLangs.filter((el) => {
            return !existing_codes.includes(el.code);
        });

        let currentLang = ISO6391.getName(deckLanguage.toLowerCase().substr(0,2));

        return (
        <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='translationModalHeader'
               aria-describedby='translationModalDesc' open={this.props.isOpen}
               onClose={this.props.handleClose}>
            <Header icon='translate' content='See the deck in other language' id='translationModalHeader'/>
            <Modal.Content>
                <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.isOpen}>
                <div>
                    <Grid stackable columns='equal'>
                        <Button basic disabled tabIndex="0" aria-label="Current language"><font color='black'><b>{currentLang}</b></font></Button>
                        { translations.map(this.renderAvailable, this) }
                        { supported.map(this.renderTranslateTo, this) }
                    </Grid>
                    </div>
                <Divider/>
                    <div>
                        <Button as='button' onClick={this.props.handleClose}><Icon name='close'/> Close</Button>
                    </div>
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
