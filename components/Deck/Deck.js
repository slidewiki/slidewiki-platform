import React from 'react';
import NavigationPanel from './NavigationPanel/NavigationPanel';
import TreePanel from './TreePanel/TreePanel';
import ContentPanel from './ContentPanel/ContentPanel';
import ContributorsPanel from './ContributorsPanel/ContributorsPanel';

class Deck extends React.Component {
    render() {
        return (
            <div className="ui vertically padded grid page" ref="deck">

              <div className="row">
                <div className="column">
                  <NavigationPanel />
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
                  <div className="row">

                  </div>
                  <div className="row">

                  </div>
                </div>

                <div className="three wide column">
                  <ContributorsPanel />
                </div>

              </div>
            </div>
        );
    }
}

export default Deck;
