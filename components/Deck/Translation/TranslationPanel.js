import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ISO6391 from 'iso-639-1';
import {NavLink, navigateAction} from 'fluxible-router';
import translateDeckRevision from '../../../actions/translateDeckRevision.js';

import { Dropdown, Menu, Flag, Button, Modal, Popup , Header} from 'semantic-ui-react';

import TranslationStore from '../../../stores/TranslationStore';
import UserProfileStore from '../../../stores/UserProfileStore';
import loadSlidePreview from '../../../actions/slide/loadSlidePreview';
import SlidePreviewModal from './SlidePreviewModal';


class TranslationPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            previewModal: false,
            previewLanguage: null
        };
    }

    handleLanguageClick(id){

        this.context.executeAction(navigateAction, {
            url: '/deck/'+ id
        });
    }

    showSlidePreview(id, language){
        this.context.executeAction(loadSlidePreview, {params: {'sid' : id}});
        this.setState({previewModal: true, previewLanguage: language});
    }


    // handleTranslateToClick(event,data){
    //     //$(document).find('#deckViewPanel').prepend('<div className="ui active dimmer"><div className="ui text loader">Loading</div></div>');
    //     this.context.executeAction(translateDeckRevision, {
    //         // TODO this is wrong, the second part for a lanugage code is the COUNTRY not the language, so for greek the el_EL is invalid
    //         language: data.value+'_'+data.value.toUpperCase()
    //     });
    //     this.dropDown.setValue('');
    //
    //
    //     //
    // }

    renderAvailable(translation) {
        if (translation.language !== this.props.TranslationStore.currentLang.language){
            let languageName = '';
            if(translation.language){
                languageName = ISO6391.getName(translation.language.toLowerCase().substr(0,2));
            }
            if (languageName){
                if (translation.deck_id){
                    return (
                        <Dropdown.Item
                        key = {translation.language}
                        onClick={ this.handleLanguageClick.bind(this, translation.deck_id) }
                        //href={''}
                        >
                        {languageName}
                        </Dropdown.Item>
                    );
                }else if (translation.slide_id){
                    return (
                        <Dropdown.Item
                        key = {translation.language}
                        onClick={ this.showSlidePreview.bind(this, translation.slide_id, languageName) }
                        //href={''}
                        >
                        {languageName}
                        </Dropdown.Item>
                    );
                }

            }
        }
    }

    renderTranslateTo(supported) {

        return (
            {value:supported.code , text: supported.name}
        );

    }

    render() {
        let deckLanguage = '';
        this.props.TranslationStore.currentLang ? deckLanguage = this.props.TranslationStore.currentLang.language : deckLanguage = 'Undefined';
        //console.log(this.props.TranslationStore);

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
        const user = this.props.UserProfileStore.userid;
        let divider = (user && translations.length) ? <Dropdown.Divider /> : '';

        let languageOptions = supported.map(this.renderTranslateTo, this);

        let currentLang = deckLanguage ?
            <span>{ISO6391.getName(deckLanguage.toLowerCase().substr(0,2))}</span>
            : <span>English</span>;



        return(


            <span>

            <SlidePreviewModal languageName={this.state.previewLanguage} slide={this.props.TranslationStore.slideToPreview} isOpen={this.state.previewModal} handleClose={() => this.setState({previewModal: false})} />

            <b>Language: </b>

                {translations.length ? (
                    <Dropdown inline item trigger={currentLang}>
                        <Dropdown.Menu>
                        { translations.map(this.renderAvailable, this) }
                        </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <span>{currentLang}</span>
                )}
            </span>
        );
    }

}

TranslationPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
TranslationPanel = connectToStores(TranslationPanel, [TranslationStore, UserProfileStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default TranslationPanel;
