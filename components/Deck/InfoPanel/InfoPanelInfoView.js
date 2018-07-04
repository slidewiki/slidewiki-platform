import PropTypes from 'prop-types';
import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
//import ActivityList from '../ActivityFeedPanel/ActivityList';
import ActivityFeedPanel from '../ActivityFeedPanel/ActivityFeedPanel';
import ContributorsPanel from '../ContentModulesPanel/ContributorsPanel/ContributorsPanel';
import cheerio from 'cheerio';
import PresentationPanel from './PresentationsPanel';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import {getLanguageName} from '../../../common';
import TranslationStore from '../../../stores/TranslationStore';
import PermissionsStore from '../../../stores/PermissionsStore';
import {defineMessages} from 'react-intl';
import {flagForLocale} from '../../../configs/locales';
import Util from '../../common/Util';
import TranslationItem from './TranslationItem';
import loadDecktreeAndSwitchLanguage from '../../../actions/translation/loadDecktreeAndSwitchLanguage';
import addDeckTranslation from '../../../actions/translation/addDeckTranslation';
import addSlideTranslation from '../../../actions/translation/addSlideTranslation';
import {Dropdown} from 'semantic-ui-react';

class InfoPanelInfoView extends React.Component {
    constructor(props){
        super(props);
        this.messages = defineMessages({
            language:{
                id: 'ContentActionsHeader.language',
                defaultMessage:'Language'
            },
            translation:{
                id: 'ContentActionsHeader.translation',
                defaultMessage:'Translation'
            }
        });
    }

    getNameofNodes(tree, selector) {
        if(!selector.get('spath')){
            return 0;
        }
        let names = [];
        let nodes = selector.get('spath').split(';');
        let currentChildren = tree.get('children');
        let position = 0;
        nodes.forEach ((node, index) => {
            position = node.split(':')[1];
            names.push(currentChildren.get(position - 1).get('title'));
            if(currentChildren.get(position - 1).get('children')){
                currentChildren = currentChildren.get(position - 1).get('children');
            }
        });
        return names;
    }

    changeCurrentLanguage(e, { value: language }) {
        let variant = this.props.TranslationStore.variants.find((v) => v.language === language);
        if (!variant) return;

        // we need to create the href to navigate to
        let selector = this.props.DeckTreeStore.selector.toJS();
        // first, check selector type
        if (selector.stype === 'slide') {
            let oldSlideId = selector.sid;
            selector.sid = `${variant.id}-${variant.revision}`;
            // replace current slide id with translation slide id in spath as well
            selector.spath = selector.spath.replace(new RegExp(oldSlideId, 'g'), selector.sid);
        } // else it's a deck, no spath replacing needed

        let href = Util.makeNodeURL(selector, 'deck', '', this.props.DeckTreeStore.slug, language);

        this.context.executeAction(navigateAction, { url: href });
    }

    addNodeTranslation() {
        let selector = this.props.DeckTreeStore.selector.toJS();
        if (selector.stype === 'slide') {
            this.context.executeAction(addSlideTranslation, {
                selector,
                language: this.props.TranslationStore.currentLang,
            });
        } else {
            this.context.executeAction(addDeckTranslation, {
                id: selector.sid || selector.id,
                language: this.props.TranslationStore.currentLang,
            });
        }
    }

    render() {
        let deckTree = this.props.DeckTreeStore.deckTree;
        let selector = this.props.DeckTreeStore.selector;
        //let selector = this.props.DeckTreeStore.selector;
        ///let prevSelector = this.props.DeckTreeStore.prevSelector;
        //let nextSelector = this.props.DeckTreeStore.nextSelector;

        //change the node icon based on the type of node and its expanded state
        //let iconClass = classNames({
        //    'ui icon': true,
        //    'grey file text': (this.props.DeckTreeStore.get('type') === 'slide'),
        //    'yellow folder link': (this.props.DeckTreeStore.get('type') === //'deck'),
        //});

        let rootNode = {'title': deckTree.get('title'), 'id': deckTree.get('id')};
        let self = this;
        let nodes = [];
        let list, output = '';
        let title = '';
        let titlediv;
        let pathNames = this.getNameofNodes(deckTree, selector);
        if(selector.get('spath')){
            nodes = selector.get('spath').split(';');
            list = nodes.map((node, index) => {
                if(index === (nodes.length - 1)){
                    return (
                        cheerio.load(pathNames[index]).text()
                    );
                }else{
                    /*
                    return (
                        <div key={index} className="section">
                            <NavLink href={'/deck/' + self.props.selector.get('id') + '/deck/' + self.props.selector.get('sid') + '/' + (nodes[index - 1] ? (nodes[index - 1] + ';') : '') + node}>{this.props.pathNames[index]}</NavLink>
                            <i className="right chevron icon divider"></i>
                        </div>
                    );
                    */
                }

            });
            title = list; //use title of slide
            titlediv =
            <div className="ui segment top attached compact">
                <h3 className="ui small header">
                   <i className="grey small file text icon" aria-label="Slide title"></i>
                   {title}
                </h3>
            </div>;

        }
        else {
            //title = rootNode.title;
            //title = ''; //use title of deck
            titlediv = '';

        }

        let language = this.props.TranslationStore.nodeLanguage;
        let primaryLanguage = this.props.TranslationStore.originLanguage;

        // let's see if the user wants something we don't have
        let translationMissing = this.props.TranslationStore.currentLang && this.props.TranslationStore.currentLang !== language;
        let currentLangIconName = (flagForLocale(this.props.TranslationStore.currentLang) || 'icon') + ' flag';

        let languageMessage = (language === primaryLanguage) ? this.messages.language : this.messages.translation;

        let languages = this.props.TranslationStore.variants.map((v) => v.language);
        if (this.props.TranslationStore.currentLang && languages.indexOf(this.props.TranslationStore.currentLang) < 0) {
            // put the current (but unavailable) language first
            languages.unshift(this.props.TranslationStore.currentLang);
        }
        let languageOptions = languages.map((t) => ({
            text: getLanguageName(t) + (t === primaryLanguage ? ' (primary)' : ''),
            value: t,
            flag: flagForLocale(t),
            icon: !flagForLocale(t) && 'flag',
        }));

        let canEdit = this.props.PermissionsStore.permissions.edit && !this.props.PermissionsStore.permissions.readOnly;

        return (
            <div className="ui container" ref="infoPanel" role="complementary">
                {this.props.DeckTreeStore.revisionId !== this.props.DeckTreeStore.latestRevisionId &&
                    <div className="ui vertical segment"><NavLink className="" href={'/deck/' + selector.get('id').split('-')[0]}><i className='warning sign icon'></i>
                        Updated version available</NavLink>
                    </div>}
                    {titlediv}
                <div className="ui attached segment">
                    { !canEdit && this.props.TranslationStore.translations.length ?
                        <div>
                            <h5 className="ui small header">{this.context.intl.formatMessage(this.messages.language)}:</h5>
                            <Dropdown fluid selection
                                defaultValue={this.props.TranslationStore.currentLang || this.props.TranslationStore.nodeLanguage}
                                options={languageOptions} onChange={this.changeCurrentLanguage.bind(this)} />

                            { translationMissing ? 
                                <div className="ui message">
                                    Translation to {getLanguageName(this.props.TranslationStore.currentLang)} is missing.
                                    Actual content is in {getLanguageName(this.props.TranslationStore.originLanguage)}.
                                </div>
                              : ''
                            }
                        </div>
                        : ''
                    }

                    { translationMissing && canEdit ? 
                        <div className="ui selection list">
                            <h5 className="ui small header">Translation missing:</h5>
                            <div className="item">
                                <div role="button" className="header" data-tooltip="Add translation"
                                    onClick={this.addNodeTranslation.bind(this)}
                                    aria-label="Add translation" aria-required >
                                    <i className={currentLangIconName}></i>{getLanguageName(this.props.TranslationStore.currentLang)}
                                </div>
                            </div>
                        </div>
                        : ''
                    }

                    { canEdit || this.props.TranslationStore.translations.length === 0 ?
                        <div className="ui selection list">
                            <h5 className="ui small header">{this.context.intl.formatMessage(this.messages.language)}:</h5>
                            <TranslationItem language={language} primary={this.props.TranslationStore.translations.length && language === primaryLanguage}
                                selector={this.props.DeckTreeStore.selector.toJS()} slug={this.props.DeckTreeStore.slug} />
                        </div>
                        : ''
                    }

                    { canEdit && this.props.TranslationStore.translations.length ? 
                            <div className="ui selection list">
                                <h5 className="ui small header">Also available in:</h5>
                                {
                                    this.props.TranslationStore.variants.map((variant, index) => {
                                        // skip same language
                                        if (variant.language === language) return '';

                                        // we need to create the href for the translation link item
                                        let selector = this.props.DeckTreeStore.selector.toJS();
                                        // first, check selector type
                                        if (selector.stype === 'slide') {
                                            let oldSlideId = selector.sid;
                                            selector.sid = `${variant.id}-${variant.revision}`;
                                            // replace current slide id with translation slide id in spath as well
                                            selector.spath = selector.spath.replace(new RegExp(oldSlideId, 'g'), selector.sid);
                                        } // else it's a deck, no spath replacing needed

                                        return (<TranslationItem key={index} language={variant.language} primary={variant.language === primaryLanguage}
                                            selector={selector} slug={this.props.DeckTreeStore.slug} />
                                        );
                                    })
                                }
                            </div>
                        : ''
                    }

                </div>
                <div className="ui attached segment">
                    <ContributorsPanel />
                </div>
                <div className="ui attached segment">
                    <ActivityFeedPanel />
                </div>
                {this.props.ActivityFeedStore.selector.stype === 'deck' ? (
                  <div className="ui attached segment">
                      <PresentationPanel />
                  </div>
                ) : ''}

                <div className="ui attached segment">
                    <div className={['ui', 'image']}>
                        <a href="http://creativecommons.org/licenses/by-sa/4.0/" target="_blank" tabIndex="-1" alt="">
                            <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
                        </a>
                        <p>
                            This work is licensed under a <a rel="license"  target="_blank" href="http://creativecommons.org/licenses/by-sa/4.0/" >Creative Commons Attribution-ShareAlike 4.0 International License</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

InfoPanelInfoView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
};
InfoPanelInfoView= connectToStores(InfoPanelInfoView, [ActivityFeedStore, DeckTreeStore, TranslationStore, PermissionsStore], (context, props) => {
    return {
        ActivityFeedStore: context.getStore(ActivityFeedStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        TranslationStore: context.getStore(TranslationStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState(),
    };
});
export default InfoPanelInfoView;
