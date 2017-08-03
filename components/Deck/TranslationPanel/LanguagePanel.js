import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ISO6391 from 'iso-639-1';
import {NavLink, navigateAction} from 'fluxible-router';
import translateDeckRevision from '../../../actions/translateDeckRevision.js';

import { Dropdown, Menu, Flag, Button, Modal, Popup } from 'semantic-ui-react';

import TranslationStore from '../../../stores/TranslationStore';

// import TranslationStore from '../../../stores/TranslationStore';
// import TranslationList from './TranslationList';

class LanguagePanel extends React.Component {


    handleLanguageClick(e, data){
        if (data.value){
            this.context.executeAction(navigateAction, {
                url: '/deck/'+ data.value
            });
            this.dropDown.setValue('');
        }
    }
    renderAvailable(translation) {
        if (translation.language !== this.props.TranslationStore.currentLang.language){
            let languageName = ISO6391.getName(translation.language.toLowerCase().substr(0,2));
            if (languageName){
                return (
                    {value:translation.deck_id , text: languageName}
                );
            }else{
                return;
            }
        }else{
            return;
        }
    }
    render() {
        const deckLanguage = this.props.TranslationStore.currentLang.language;
        const translations = this.props.TranslationStore.translations;
        let currentLang = <span><i className='icon comments'/>{ISO6391.getName(deckLanguage.toLowerCase().substr(0,2))}</span>;

        let options = translations.map(this.renderAvailable, this).filter((option) => {
            return option;
        });

        return(

            <Dropdown
                item
                scrolling
                trigger={currentLang}
                options = {options}
                onChange = {this.handleLanguageClick.bind(this)}
                ref = {(dropDown) => {this.dropDown = dropDown;}}
            />

        );
    }

}

LanguagePanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
LanguagePanel = connectToStores(LanguagePanel, [TranslationStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState(),
    };
});
export default LanguagePanel;
