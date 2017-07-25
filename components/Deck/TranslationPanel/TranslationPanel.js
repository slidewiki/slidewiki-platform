import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ISO6391 from 'iso-639-1';
import {NavLink, navigateAction} from 'fluxible-router';
import translateDeckRevision from '../../../actions/translateDeckRevision.js';

import { Dropdown, Menu, Flag, Button, Modal, Popup } from 'semantic-ui-react';

import TranslationStore from '../../../stores/TranslationStore';
import UserProfileStore from '../../../stores/UserProfileStore';

// import TranslationStore from '../../../stores/TranslationStore';
// import TranslationList from './TranslationList';

class TranslationPanel extends React.Component {

        /*componentDidMount() {
        this.enableDropdown();
    }
    componentDidUpdate(){
        this.enableDropdown();
    }
    enableDropdown(status) {
        let panelDIV = this.refs.translationPanel;
        $(panelDIV).find('.ui.selection.dropdown').dropdown({
            onChange: (value) => {
                this.context.executeAction(navigateAction, {
                    //todo: define how we are going to handle URIs for translations
                    url: '/deck/' + value
                });
            }
        });
    }
    render() {
        return (
            <div className="ui left aligned" ref="translationPanel">
                <div className="ui fluid search selection dropdown">
                    <div className="default text">{this.props.TranslationStore.currentLang.lang}</div>
                    <i className="dropdown icon"></i>
                        <TranslationList items={this.props.TranslationStore.translations} />
                </div>
            </div>
        );
    }
    */
    handleLanguageClick(id){

        this.context.executeAction(navigateAction, {
            url: './deck/'+ id
        });
    }

    handleTranslateToClick(code){

        this.context.executeAction(translateDeckRevision, {
            language: code+'_'+code
        });
    }

    renderAvailable(translation) {
        if (translation.lang !== this.props.TranslationStore.currentLang.lang){
            let languageName = ISO6391.getName(translation.lang.toLowerCase());
            if (languageName){
                return (
                    <Dropdown.Item
                    key = {translation.lang}
                    onClick={ this.handleLanguageClick.bind(this, translation.id) }
                    //href={''}
                    >
                    {languageName}
                    </Dropdown.Item>
                );
            }
        }
    }

    renderTranslateTo(supported) {
        if (supported.key !== this.props.TranslationStore.currentLang.lang){

            return (
                <Dropdown.Item
                key = {supported.code}
                onClick={ this.handleTranslateToClick.bind(this, supported.code) }
                //href={''}
                >
                {supported.name}
                </Dropdown.Item>
            );
        }

    }

    render() {
        const deckLanguage = this.props.TranslationStore.currentLang.lang;
        const translations = this.props.TranslationStore.translations;
        const supported = this.props.TranslationStore.supportedLangs;
        const user = this.props.UserProfileStore.userid;
        let divider = user ? <Dropdown.Divider /> : '';
        let translate_item = user ?
        <Dropdown scrolling item trigger={ <span>Translate</span>}>
            <Dropdown.Menu>
                {supported.map(this.renderTranslateTo, this)}
            </Dropdown.Menu>
        </Dropdown>  : '';

        let currentLang = <span><i className='icon comments'/>{ISO6391.getName(deckLanguage.toLowerCase())}</span>;
        return(

            <Dropdown item trigger={currentLang}>
                <Dropdown.Menu>
                { translations.map(this.renderAvailable, this) }
                        {divider}
                        {translate_item}
                </Dropdown.Menu>
            </Dropdown>

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
