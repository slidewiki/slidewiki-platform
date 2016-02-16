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
            <div className="ui vertically padded grid page" ref="deck">

              <div className="row">
                <div className="thirteen wide column">
                  <NavigationPanel />
                </div>
                <div className="three wide column">
                  <TranslationPanel />
                </div>
              </div>

              <div className="ui hidden divider"></div>

              <div className="row">

                <div className="four wide column">
                  <TreePanel />
                </div>

                <div className="nine wide column">
                  <div className="row">
                    <ContentPanel />
                  </div>
                  <br/>
                  <div className="row">
                      <ActivityFeedPanel />
                  </div>
                </div>

                <div className="three wide column">
                    <div className="row">
                        <ContributorsPanel />
                    </div>
                    <br/>
                    <div className="row">
                        <DataSourcePanel />
                    </div>
                </div>

              </div>
            </div>
        );
    }
}

export default Deck;
