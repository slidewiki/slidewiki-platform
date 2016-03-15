import React from 'react';
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
        return (
            <div className="ui vertically padded stackable grid page" ref="deck">

              <div className="row">
                  <div className="four wide column">
                    <TranslationPanel />
                  </div>
                <div className="twelve wide column">
                  <NavigationPanel />
                </div>
              </div>

              <div className="row">
                <div className="four wide column">
                    <div className="row">
                        <TreePanel mode={this.props.DeckPageStore.mode} page={this.props.DeckPageStore.page}/>
                    </div>
                    <div className="ui hidden divider"></div>
                    <div className="row">
                        <ContributorsPanel />
                    </div>
                    <div className="ui hidden divider"></div>
                    <div className="row">
                        <SimilarContentPanel />
                    </div>
                </div>
                <div className="twelve wide column">
                  <div className="row">
                    <ContentPanel />
                  </div>
                  <div className="ui hidden divider"></div>
                  <div className="row">
                      {this.props.DeckPageStore.mode !== 'view'? '' : <ActivityFeedPanel />}
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
