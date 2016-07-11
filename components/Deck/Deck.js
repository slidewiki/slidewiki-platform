import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckPageStore from '../../stores/DeckPageStore';
import hideLeftColumn from '../../actions/deckpagelayout/hideLeftColumn';
import restoreDeckPageLayout from '../../actions/deckpagelayout/restoreDeckPageLayout';
import NavigationPanel from './NavigationPanel/NavigationPanel';
import TranslationPanel from './TranslationPanel/TranslationPanel';
import TreePanel from './TreePanel/TreePanel';
import ContentPanel from './ContentPanel/ContentPanel';
import ContributorsPanel from './ContributorsPanel/ContributorsPanel';
import ActivityFeedPanel from './ActivityFeedPanel/ActivityFeedPanel';
import SimilarContentPanel from './SimilarContentPanel/SimilarContentPanel';
import ErrorComponent from '../../components/Errors/Error'

class Deck extends React.Component {
    handleExpandClick(){
        this.context.executeAction(hideLeftColumn, {});
        return false;
    }
    handleCollapseClick(){
        this.context.executeAction(restoreDeckPageLayout, {});
        return false;
    }
    render() {
        if (this.props.DeckPageStore.error) {
            return (
                <div ref="deck">
                    <ErrorComponent errorMsg={this.props.DeckPageStore.error}/>
                </div>
            )
        }
        else {
            let status = this.props.DeckPageStore.componentsStatus;
            let translationPanelClass = classNames({
                'four': status.TranslationPanel.columnSize===4,
                'wide column': status.TranslationPanel.visible,
                'hide-element': !status.TranslationPanel.visible
            });
            let navigationPanelClass = classNames({
                'twelve': status.NavigationPanel.columnSize===12,
                'sixteen': status.NavigationPanel.columnSize===16,
                'wide column': status.NavigationPanel.visible,
                'hide-element': !status.NavigationPanel.visible
            });
            let leftColClass = classNames({
                'four':  (status.TreePanel.columnSize===4 || status.ContributorsPanel.columnSize===4 || status.SimilarContentPanel.columnSize===4 || status.TranslationPanel.columnSize===4),
                'twelve':  status.TreePanel.columnSize===12 || status.ContributorsPanel.columnSize===12 || status.SimilarContentPanel.columnSize===12 || status.TranslationPanel.columnSize===12,
                'sixteen':  status.TreePanel.columnSize===16 || status.ContributorsPanel.columnSize===16 || status.SimilarContentPanel.columnSize===16 || status.TranslationPanel.columnSize===16 ,
                'wide column': status.TranslationPanel.visible || status.TreePanel.visible || status.ContributorsPanel.visible || status.SimilarContentPanel.visible,
                'hide-element': !status.TranslationPanel.visible && !status.TreePanel.visible && !status.ContributorsPanel.visible && !status.SimilarContentPanel.visible
            });
            let treePanelClass = classNames({
                'hide-element': !status.TreePanel.visible
            });
            let contributorsPanelClass = classNames({
                'hide-element': !status.ContributorsPanel.visible
            });
            let similarContentPanelClass = classNames({
                'hide-element': !status.SimilarContentPanel.visible
            });
            let rightColClass = classNames({
                'four':  status.ContentPanel.columnSize===4 || status.ActivityFeedPanel.columnSize===4 || status.NavigationPanel.columnSize===4,
                'twelve':  status.ContentPanel.columnSize===12 || status.ActivityFeedPanel.columnSize===12 || status.NavigationPanel.columnSize===12,
                'sixteen':  status.ContentPanel.columnSize===16 || status.ActivityFeedPanel.columnSize===16 || status.NavigationPanel.columnSize===16,
                'wide column': status.ContentPanel.visible || status.ActivityFeedPanel.visible || status.NavigationPanel.visible
            });
            let contentPanelClass = classNames({
                'twelve':  status.ContentPanel.columnSize===12,
                'sixteen':  status.ContentPanel.columnSize===16,
                'wide column': status.ContentPanel.visible,
                'hide-element': !status.ContentPanel.visible
            });
            let activityFeedPanelClass = classNames({
                'twelve':  status.ActivityFeedPanel.columnSize===12,
                'sixteen':  status.ActivityFeedPanel.columnSize===16,
                'wide column': status.ActivityFeedPanel.visible,
                'hide-element': !status.ActivityFeedPanel.visible
            });
            let oneColumnMode = 0;
            if(!status.TranslationPanel.visible && !status.TreePanel.visible && !status.ContributorsPanel.visible && !status.SimilarContentPanel.visible){
                oneColumnMode = 1;
            }
            let dividerDIV = '';
            if(oneColumnMode){
                if(status.ActivityFeedPanel.visible){
                    dividerDIV = <div className="ui" onClick={this.handleCollapseClick.bind(this)} title="show deck tree"><i className="icon link angle double right"></i> </div>;
                }
            }else{
                dividerDIV = <div className="ui vertical hidden divider fitted" onClick={this.handleExpandClick.bind(this)} title="hide deck tree"><i className="icon link angle double left"></i> </div>;
            }
            return (
                <div className="ui vertically padded stackable grid page" ref="deck">

                    <div className={leftColClass}>
                        <div className="row">
                            <div className={translationPanelClass}>
                              <TranslationPanel />
                            </div>
                        </div>
                        <div className="ui hidden fitted divider"></div>
                        <div className="row">
                            <div className={treePanelClass}>
                                <TreePanel mode={this.props.DeckPageStore.mode} page={this.props.DeckPageStore.page}/>
                            </div>
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

                    {dividerDIV}

                    <div className={rightColClass}>
                        <div className="row">
                          <div className={navigationPanelClass}>
                            <NavigationPanel />
                          </div>
                        </div>
                        <div className="ui hidden fitted divider"></div>
                        <div className="row">
                            <div className={contentPanelClass}>
                                <ContentPanel />
                            </div>
                            <div className={activityFeedPanelClass}>
                                <div className="ui hidden divider"></div>
                                <div className="row">
                                    {this.props.DeckPageStore.mode !== 'view'? '' : <ActivityFeedPanel />}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            );
        }
    }
}



Deck.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
Deck = connectToStores(Deck, [DeckPageStore], (context, props) => {
    return {
        DeckPageStore: context.getStore(DeckPageStore).getState()
    };
});
export default Deck;
