import PropTypes from 'prop-types';
import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import ActivityFeedPanel from '../ActivityFeedPanel/ActivityFeedPanel';
import ContributorsPanel from '../ContentModulesPanel/ContributorsPanel/ContributorsPanel';
import PresentationsPanel from './PresentationsPanel';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import {getLanguageName, equals} from '../../../common';
import TranslationStore from '../../../stores/TranslationStore';
import PermissionsStore from '../../../stores/PermissionsStore';
import {defineMessages} from 'react-intl';
import zoom from '../../../actions/slide/zoom';
import ContentStore from '../../../stores/ContentStore';


class InfoPanelInfoView extends React.Component {

    constructor(props) {
        super(props);
        this.isLoading = true;
        this.messages = defineMessages({
        });

        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.resetZoom = this.resetZoom.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const samePropsState = equals(this.props, nextProps);
        this.isLoading = nextProps.loadingIndicator;
        // Content should be updated only when properties have changed.
        return !samePropsState;
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
        let showZoomControls = this.props.ContentStore.selector.stype === 'slide';

        let deckId = selector.get('id');
        if (deckId) {
            deckId = deckId.split('-')[0];
        }

        return (
            <div className="ui container" ref="infoPanel" role="complementary" aria-labelledby="infopanel-title">
                {this.isLoading && <div className="ui active dimmer"><div className="ui text loader">Loading</div></div>}
                {
                    showZoomControls &&
                        <div className="ui top attached basic buttons menu" role="menu">
                            <button className="ui icon button" role="menuitem" onClick={this.zoomOut}
                                    aria-label="Zoom out" data-tooltip="Zoom out">
                                <i className="large zoom out icon"></i>
                            </button>
                            <button className="ui icon button" role="menuitem" onClick={this.resetZoom}
                                    aria-label="Reset zoom" data-tooltip="Reset zoom">
                                <i className="large stacked icons">
                                    <i className="mini compress icon" style={{ paddingTop: '40%' }}></i>
                                    <i className="search icon"></i>
                                </i>
                            </button>
                            <button className="ui icon button" role="menuitem" onClick={this.zoomIn}
                                    aria-label="Zoom in" data-tooltip="Zoom in">
                                <i className="large zoom in icon"></i>
                            </button>
                        </div>
                }
                <h3 className="sr-only" id="infopanel-title">Additional content information</h3>
                { deckId && this.props.DeckTreeStore.revisionId !== this.props.DeckTreeStore.latestRevisionId &&
                    <div className="ui attached segment">
                        <NavLink href={['/deck', deckId, 'deck', deckId].join('/')}>
                            <i className='warning sign icon'></i>
                            Updated version available
                        </NavLink>
                    </div>
                }

                <div className="ui attached segment">
                    <ContributorsPanel />
                </div>
                <div className="ui attached segment">
                    <ActivityFeedPanel />
                </div>
                {this.props.ActivityFeedStore.selector.stype === 'deck' ? (
                  <div className="ui attached segment">
                      <PresentationsPanel />
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
