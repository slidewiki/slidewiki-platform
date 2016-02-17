import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';

class TreePanel extends React.Component {
    render() {
        return (
            <div className="ui panel sw-tree-panel" ref="treePanel">

                <div className="ui segments">
                    <div className="3 fluid ui attached bottom tertiary small icon buttons">
                        <div className="ui button">
                            <i className="blue add icon"></i>
                        </div>
                        <div className="ui button">
                            <i className="teal edit icon"></i>
                        </div>
                        <div className="ui button">
                            <i className="red remove icon"></i>
                        </div>
                    </div>
                  <div className="ui secondary segment">
                    <b><NavLink href="/deck/56">Semantic Web</NavLink></b>
                  </div>
                  <div className="ui segment">
                      <div className="ui celled ordered list">
                        <div className="item">Introduction</div>
                        <div className="item"><b>RDF</b>
                            <div className="list">
                              <div className="item"><b><b><NavLink href="/deck/56/slide/24">Introduction</NavLink></b></b></div>
                              <div className="item">Serializations</div>
                              <div className="item">Examples</div>
                            </div>
                        </div>
                        <div className="item">Cats</div>
                        <div className="item">Horses</div>
                        <div className="item">Dogs
                          <div className="list">
                            <div className="item">Labradoodles</div>
                            <div className="item">Shiba Inu</div>
                            <div className="item">Mastiff</div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>

             </div>
        );
    }
}

TreePanel = connectToStores(TreePanel, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default TreePanel;
