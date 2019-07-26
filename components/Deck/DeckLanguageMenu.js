import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages} from 'react-intl';

import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';

import {flagForLocale} from '../../configs/locales';
import {getLanguageName} from '../../common';
import Util from '../common/Util';

import {Dropdown, Button, Icon, Flag} from 'semantic-ui-react';

import DeckTreeStore from '../../stores/DeckTreeStore';
import DeckPageStore from '../../stores/DeckPageStore';
import PermissionsStore from '../../stores/PermissionsStore';
import TranslationStore from '../../stores/TranslationStore';

class DeckLanguageMenu extends React.Component {

    constructor(props) {
        super(props);

        this.messages = defineMessages({
            selectLanguage:{
                id: 'InfoPanelInfoView.selectLanguage',
                defaultMessage:'Select language'
            },
        });
    }

    changeCurrentLanguage(e, { value: language }) {
        // exclude keyboard events except Enter
        if (!(e.code && e.code === 'Enter' || !e.code)) {
            return;
        }
        if (language === 'addNew') {
            $('#DeckTranslationsModalOpenButton').click();
            return;
        }
        if (language === 'translateSlide') {
            $('#SlideTranslationsModalOpenButton').click();
            return;
        }

        // we need to create the href to navigate to
        let selector = this.props.DeckTreeStore.selector.toJS();
        // first, check selector type
        if (selector.stype === 'slide') {
            // for slides, we need to find the proper slide variant
            let variant = this.props.TranslationStore.nodeVariants.find((v) => v.language === language);
            if (!variant) {
                // try to find a variant for the primary tree language to provide as fallback
                variant = this.props.TranslationStore.nodeVariants.find((v) => v.language === this.props.TranslationStore.treeLanguage);
                if (!variant) {
                    // if still no variant, get the variant for the primary language of the slide as saved
                    variant = this.props.TranslationStore.nodeVariants.find((v) => v.language === this.props.TranslationStore.originLanguage);
                }
            }

            if (variant) {
                let oldSlideId = selector.sid;
                selector.sid = `${variant.id}-${variant.revision}`;
                // replace current slide id with translation slide id in spath as well
                selector.spath = selector.spath.replace(new RegExp(oldSlideId, 'g'), selector.sid);
            } // else change nothing and hope for the best :)

        } // else it's a deck, no spath replacing needed

        let href = Util.makeNodeURL(selector, 'deck', '', this.props.DeckTreeStore.slug, language);

        this.context.executeAction(navigateAction, { url: href });
    }

    render() {
        let canEdit = this.props.PermissionsStore.permissions && this.props.PermissionsStore.permissions.edit && !this.props.PermissionsStore.permissions.readOnly;

        let primaryLanguage = this.props.TranslationStore.treeLanguage;
        let languages = [primaryLanguage, ...this.props.TranslationStore.treeTranslations];
        if (this.props.TranslationStore.currentLang && languages.indexOf(this.props.TranslationStore.currentLang) < 0) {
            // put the current (but unavailable) language first
            languages.unshift(this.props.TranslationStore.currentLang);
        }
        // remove duplicates
        languages = languages.filter((elem, pos) => {
            return languages.indexOf(elem) === pos;
        });

        let languageOptions = languages.map((t) => ({
            text: getLanguageName(t) + (t === primaryLanguage ? ' (primary)' : ''),
            value: t,
            flag: flagForLocale(t),
            icon: !flagForLocale(t) && 'flag',
        }));

        if (canEdit) {
            languageOptions.push({
                text: 'Add a new translation',
                value: 'addNew',
                icon: 'translate',
                key: 'placeholderForAddANewTranslation'
            });
            // we need to create the href to navigate to
            let selector = this.props.DeckTreeStore.selector.toJS();
            if (selector.stype === 'slide' && (this.props.DeckPageStore.mode === 'markdownEdit' || this.props.DeckPageStore.mode === 'edit'))
            {
                languageOptions.push({
                    text: 'Translate Slide',
                    value: 'translateSlide',
                    icon: 'translate',
                    key: 'placeholderForTranslateSlide'
                });
            }
        }

        // the user selected language (defaults to the primary deck tree language)
        let selectedLanguage = this.props.TranslationStore.currentLang || primaryLanguage;
        let selectedLanguageIcon = (flagForLocale(selectedLanguage) || 'icon');
        let selectedLanguageName = getLanguageName(selectedLanguage);
        let selectLanguageMessage = this.context.intl.formatMessage(this.messages.selectLanguage);

        let translatebtn = {
            padding: '16px',
            fontWeight: 'bold'
        };

        let dropdownTrigger = (
            <div className="text" data-tooltip={selectLanguageMessage}>
                <i className={selectedLanguageIcon + ' flag'} />{selectedLanguageName}
            </div>
        );

        return (
            <div>
                <div id="slide-language-label" className="sr-only">
                    {this.context.intl.formatMessage(this.messages.selectLanguage) + ' ' + selectedLanguageName}
                </div>
                <Dropdown
                    id="slide-language"
                    aria-labelledby="slide-language-label"
                    style={translatebtn}
                    fluid
                    trigger={dropdownTrigger}
                    disabled={languageOptions.length < 2 && !canEdit}
                    defaultValue={selectedLanguage} 
                    options={languageOptions} 
                    onChange={this.changeCurrentLanguage.bind(this)} 
                    className={`${this.props.lastAttached ? 'bottom' : ''} attached medium basic button`}
                    selectOnBlur={false}
                    openOnFocus={false}
                />
            </div>
        );
    }

}

DeckLanguageMenu.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
};

DeckLanguageMenu = connectToStores(DeckLanguageMenu, [DeckTreeStore, DeckPageStore, PermissionsStore, TranslationStore], (context, props) => {
    return {
        DeckPageStore: context.getStore(DeckPageStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState(),
        TranslationStore: context.getStore(TranslationStore).getState(),
    };
});

export default DeckLanguageMenu;
