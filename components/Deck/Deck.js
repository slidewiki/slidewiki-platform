import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckPageStore from '../../stores/DeckPageStore';
import NavigationPanel from './NavigationPanel/NavigationPanel';
import TranslationPanel from './TranslationPanel/TranslationPanel';
import TreePanel from './TreePanel/TreePanel';
import ContentPanel from './ContentPanel/ContentPanel';
import ContributorsPanel from './ContributorsPanel/ContributorsPanel';
import ActivityFeedPanel from './ActivityFeedPanel/ActivityFeedPanel';
import SimilarContentPanel from './SimilarContentPanel/SimilarContentPanel';

class Deck extends React.Component {
    render() {
        let translationPanelClass = classNames({
            'four': this.props.DeckPageStore.componentsStatus.TranslationPanel.size===4,
            'wide column': this.props.DeckPageStore.componentsStatus.TranslationPanel.visible,
            'hide-element': !this.props.DeckPageStore.componentsStatus.TranslationPanel.visible
        });
        let navigationPanelClass = classNames({
            'twelve': this.props.DeckPageStore.componentsStatus.NavigationPanel.size===12,
            'sixteen': this.props.DeckPageStore.componentsStatus.NavigationPanel.size===16,
            'wide column': this.props.DeckPageStore.componentsStatus.NavigationPanel.visible,
            'hide-element': !this.props.DeckPageStore.componentsStatus.NavigationPanel.visible
        });
        let treePanelClass = classNames({
            'four': this.props.DeckPageStore.componentsStatus.TreePanel.size===4,
            'wide column': this.props.DeckPageStore.componentsStatus.TreePanel.visible,
            'hide-element': !this.props.DeckPageStore.componentsStatus.TreePanel.visible
        });
        let contributorsPanelClass = classNames({
            'four':  this.props.DeckPageStore.componentsStatus.ContributorsPanel.size===4,
            'wide column': this.props.DeckPageStore.componentsStatus.ContributorsPanel.visible,
            'hide-element': !this.props.DeckPageStore.componentsStatus.ContributorsPanel.visible
        });
        let similarContentPanelClass = classNames({
            'four':  this.props.DeckPageStore.componentsStatus.SimilarContentPanel.size===4,
            'wide column': this.props.DeckPageStore.componentsStatus.SimilarContentPanel.visible,
            'hide-element': !this.props.DeckPageStore.componentsStatus.SimilarContentPanel.visible
        });
        let contentPanelClass = classNames({
            'twelve':  this.props.DeckPageStore.componentsStatus.ContentPanel.size===12,
            'sixteen':  this.props.DeckPageStore.componentsStatus.ContentPanel.size===16,
            'wide column': this.props.DeckPageStore.componentsStatus.ContentPanel.visible,
            'hide-element': !this.props.DeckPageStore.componentsStatus.ContentPanel.visible
        });
        let activityFeedPanelClass = classNames({
            'twelve':  this.props.DeckPageStore.componentsStatus.ActivityFeedPanel.size===12,
            'sixteen':  this.props.DeckPageStore.componentsStatus.ActivityFeedPanel.size===16,
            'wide column': this.props.DeckPageStore.componentsStatus.ActivityFeedPanel.visible,
            'hide-element': !this.props.DeckPageStore.componentsStatus.ActivityFeedPanel.visible
        });
        return (
            <div className="ui vertically padded stackable grid page" ref="deck">

              <div className="row">
                  <div className={translationPanelClass}>
                    <TranslationPanel />
                  </div>
                <div className={navigationPanelClass}>
                  <NavigationPanel />
                </div>
              </div>

              <div className="row">
                <div className={treePanelClass}>
                    <div className="row">
                        <TreePanel mode={this.props.DeckPageStore.mode} page={this.props.DeckPageStore.page}/>
                        <div className="ui hidden divider"></div>
                        <div className={contributorsPanelClass}>
                            <div className="row">
                                <ContributorsPanel />
                            </div>
                        </div>
                        <div className="ui hidden divider"></div>
                        <div className={similarContentPanelClass}>
                            <div className="row">
                                <SimilarContentPanel />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={contentPanelClass}>
                    <div className="row">
                        <ContentPanel />
                        <div className={activityFeedPanelClass}>
                            <div className="ui hidden divider"></div>
                            <div className="row">
                                {this.props.DeckPageStore.mode !== 'view'? '' : <ActivityFeedPanel />}
                            </div>
                        </div>
                    </div>
                </div>
              </div>

            </div>
        );
    }
}

Deck = connectToStores(Deck, [DeckPageStore], (context, props) => {
    return {
        DeckPageStore: context.getStore(DeckPageStore).getState()
    };
});
export default Deck;
