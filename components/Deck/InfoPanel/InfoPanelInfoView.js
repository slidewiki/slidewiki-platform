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
import addDeckTranslation from '../../../actions/translation/addDeckTranslation';
import addSlideTranslation from '../../../actions/translation/addSlideTranslation';
import {Button, Icon, Flag} from 'semantic-ui-react';
import zoom from '../../../actions/slide/zoom';
import ContentStore from '../../../stores/ContentStore';

class InfoPanelInfoView extends React.Component {
    constructor(props){
        super(props);
        this.messages = defineMessages({
            language:{
                id: 'InfoPanelInfoView.language',
                defaultMessage:'Language'
            },
            selectLanguage:{
                id: 'InfoPanelInfoView.selectLanguage',
                defaultMessage:'Select language'
            },
            viewLanguage:{
                id: 'InfoPanelInfoView.viewLanguage',
                defaultMessage:'You are viewing this in language'
            },
            translation:{
                id: 'InfoPanelInfoView.translation',
                defaultMessage:'Translation'
            },
            current:{
                id: 'InfoPanelInfoView.current',
                defaultMessage:'Current'
            },
            alsoAvailableIn:{
                id: 'InfoPanelInfoView.alsoAvailableIn',
                defaultMessage:'Also available in'
            },
        });

        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.resetZoom = this.resetZoom.bind(this);
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
        //exclude keyboard events except Enter
        if (!(e.code && e.code === 'Enter' || !e.code))
            return;

        if (!language) {
            $('#DeckTranslationsModalOpenButton').click();
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

    addNodeTranslation() {
        let selector = this.props.DeckTreeStore.selector.toJS();
        if (selector.stype === 'slide') {
            this.context.executeAction(addSlideTranslation, {
                selector,
                language: this.props.TranslationStore.currentLang || this.props.TranslationStore.treeLanguage,
            });
        } else {
            this.context.executeAction(addDeckTranslation, {
                selector,
                language: this.props.TranslationStore.currentLang || this.props.TranslationStore.treeLanguage,
            });
        }
    }

    zoomIn() {
        this.context.executeAction(zoom, { mode: this.props.ContentStore.mode, direction: 'in' });
    }

    resetZoom() {
        this.context.executeAction(zoom, { mode: this.props.ContentStore.mode, direction: 'reset' });
    }

    zoomOut() {
        this.context.executeAction(zoom, { mode: this.props.ContentStore.mode, direction: 'out' });
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
        let primaryLanguage = this.props.TranslationStore.treeLanguage;

        // the user selected language (defaults to the primary deck tree language)
        let selectedLanguage = this.props.TranslationStore.currentLang || primaryLanguage;
        let selectedLanguageIcon = (flagForLocale(selectedLanguage) || 'icon');
        let selectedLanguageName = getLanguageName(selectedLanguage);

        // let's see if the user wants something we don't have
        let translationMissing = selectedLanguage !== language;
        let canEdit = this.props.PermissionsStore.permissions.edit && !this.props.PermissionsStore.permissions.readOnly;

        let showZoomControls = this.props.ContentStore.selector.stype === 'slide';
        return (
            <div className="ui container" ref="infoPanel" role="complementary">
                {
                    showZoomControls &&
                        <div className="ui top attached basic buttons menu">
                            <button className="ui icon button" onClick={this.zoomOut}
                                    aria-label="Zoom out" data-tooltip="Zoom out">
                                <i className="large zoom out icon"></i>
                            </button>
                            <button className="ui button" onClick={this.resetZoom}
                                    aria-label="Reset zoom" data-tooltip="Reset zoom">
                                <i className="large stacked icons">
                                    <i className="mini compress icon" style={{ paddingTop: '40%' }}></i>
                                    <i className="search icon"></i>
                                </i>
                            </button>
                            <button className="ui icon button" onClick={this.zoomIn}
                                    aria-label="Zoom in" data-tooltip="Zoom in">
                                <i className="large zoom in icon"></i>
                            </button>
                        </div>
                }

                { this.props.DeckTreeStore.revisionId !== this.props.DeckTreeStore.latestRevisionId &&
                    <div className="ui attached segment">
                        <NavLink href={'/deck/' + selector.get('id').split('-')[0]}>
                            <i className='warning sign icon'></i>
                            Updated version available
                        </NavLink>
                    </div>
                }
                <div className="ui attached segment">

                    { translationMissing && canEdit ?
                        <div className="ui selection list">
                            <h5 className="ui small header">
                                <i className='warning sign icon' style={{fontSize : '1em!important', verticalAlign: 'baseline'}} ></i>
                                Translation missing:
                            </h5>
                            <div className="item">
                                <Button role="button" data-tooltip="Add translation"
                                  onClick={this.addNodeTranslation.bind(this)}
                                  aria-label="Add translation" aria-required
                                  tabIndex="0" attached basic >
                                    {selectedLanguageIcon === 'icon' ? <Icon name='flag' /> : <Flag name={selectedLanguageIcon} />}
                                    {selectedLanguageName}
                                </Button>
                            </div>
                        </div>
                        : null
                    }
                    { translationMissing ?
                      <div className="ui list">
                          <h5 className="ui small header">{this.context.intl.formatMessage(this.messages.viewLanguage)}:</h5>
                          <TranslationItem language={language} primary={this.props.TranslationStore.translations.length && language === primaryLanguage}
                              selector={this.props.DeckTreeStore.selector.toJS()} slug={this.props.DeckTreeStore.slug} clickable={language !== primaryLanguage} />
                      </div>
                    : ''}
                    { translationMissing && !canEdit ?
                        <div className="ui info message">
                            Translation to {getLanguageName(this.props.TranslationStore.currentLang)} is missing.
                        </div>
                        : null
                    }
                    { canEdit && this.props.TranslationStore.translations.length ?
                            <div className="ui selection list">
                                <h5 className="ui small header">{this.context.intl.formatMessage(this.messages.alsoAvailableIn)}:</h5>
                                {
                                    this.props.TranslationStore.nodeVariants.map((variant, index) => {
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
                                            selector={selector} slug={this.props.DeckTreeStore.slug} clickable={true} />
                                        );
                                    })
                                }
                            </div>
                        : null
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

                <div className="ui bottom attached segment">
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
InfoPanelInfoView= connectToStores(InfoPanelInfoView, [ActivityFeedStore, DeckTreeStore, TranslationStore, PermissionsStore, ContentStore], (context, props) => {
    return {
        ActivityFeedStore: context.getStore(ActivityFeedStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        TranslationStore: context.getStore(TranslationStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState(),
        ContentStore: context.getStore(ContentStore).getState(),
    };
});
export default InfoPanelInfoView;
