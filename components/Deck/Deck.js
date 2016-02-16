import React from 'react';
import NavigationPanel from './NavigationPanel/NavigationPanel';
import TranslationPanel from './TranslationPanel/TranslationPanel';
import TreePanel from './TreePanel/TreePanel';
import ContentPanel from './ContentPanel/ContentPanel';
import ContributorsPanel from './ContributorsPanel/ContributorsPanel';
import DataSourcePanel from './DataSourcePanel/DataSourcePanel';
import ActivityFeedPanel from './ActivityFeedPanel/ActivityFeedPanel';

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
                        <TreePanel />
                    </div>
                    <div className="ui hidden divider"></div>
                    <div className="row">
                        <ContributorsPanel />
                    </div>
                    <div className="ui hidden divider"></div>
                    <div className="row">
                        <DataSourcePanel />
                    </div>

                </div>

                <div className="twelve wide column">
                  <div className="row">
                    <ContentPanel />
                  </div>
                  <div className="ui hidden divider"></div>
                  <div className="row">
                      <ActivityFeedPanel />
                  </div>
                </div>

              </div>
            </div>
        );
    }
}

export default Deck;
