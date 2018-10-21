import PropTypes from 'prop-types';
import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import ActivityFeedPanel from '../ActivityFeedPanel/ActivityFeedPanel';
import ContributorsPanel from '../ContentModulesPanel/ContributorsPanel/ContributorsPanel';
import PresentationPanel from './PresentationsPanel';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import {getLanguageName} from '../../../common';
import TranslationStore from '../../../stores/TranslationStore';
import PermissionsStore from '../../../stores/PermissionsStore';
import {defineMessages} from 'react-intl';
import zoom from '../../../actions/slide/zoom';
import ContentStore from '../../../stores/ContentStore';

class InfoPanelInfoView extends React.Component {

    constructor(props){
        super(props);
        this.messages = defineMessages({
            viewLanguage:{
                id: 'InfoPanelInfoView.viewLanguage',
                defaultMessage:'You are viewing this in'
            },
        });

        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.resetZoom = this.resetZoom.bind(this);
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
        let selector = this.props.DeckTreeStore.selector;

        let language = this.props.TranslationStore.nodeLanguage;
        let primaryLanguage = this.props.TranslationStore.treeLanguage;

        // the user selected language (defaults to the primary deck tree language)
        let selectedLanguage = this.props.TranslationStore.currentLang || primaryLanguage;
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

                { translationMissing && canEdit ?
                    <div className="ui attached segment">
                        <div className="ui info message">
                            <p>Translation to {selectedLanguageName} is missing.</p>
                            <p>{this.context.intl.formatMessage(this.messages.viewLanguage)} {getLanguageName(language)}.</p>
                        </div>
                    </div>
                    : null
                }

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
