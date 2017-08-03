import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ISO6391 from 'iso-639-1';
import {NavLink, navigateAction} from 'fluxible-router';
import translateDeckRevision from '../../../actions/translateDeckRevision.js';

import { Dropdown, Menu, Flag, Button, Modal, Popup } from 'semantic-ui-react';

import TranslationStore from '../../../stores/TranslationStore';
import UserProfileStore from '../../../stores/UserProfileStore';


class TranslationPanel2 extends React.Component {

    handleTranslateToClick(event,data){
        this.context.executeAction(translateDeckRevision, {
            language: data.value+'_'+data.value.toUpperCase()
        });
        this.dropDown.setValue('');
    }

    renderTranslateTo(supported) {
        return (
            {value:supported.code , text: supported.name}
        );
    }

    render() {
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


        let options = supported.map(this.renderTranslateTo, this);
        return(

            <Dropdown
                as={Button}
                item
                scrolling
                options = {options}
                onChange = {this.handleTranslateToClick.bind(this)}
                ref = {(dropDown) => {this.dropDown = dropDown;}}
            />


        );
    }

}

TranslationPanel2.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
TranslationPanel2 = connectToStores(TranslationPanel2, [TranslationStore, UserProfileStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default TranslationPanel2;
