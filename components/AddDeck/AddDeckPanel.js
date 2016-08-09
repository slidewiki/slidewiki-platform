import React from 'react';
import { NavLink } from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';

class AddDeckPanel extends React.Component {
    componentDidMount() {
    }
    componentDidUpdate(){
    }
    render() {
        return (
          <NavLink className="item right" routeName="addDeck">
              <button className="ui right labeled icon button">
                  <i className="right plus icon"></i>
                  Add deck
              </button>
          </NavLink>
        );
    }
}

AddDeckPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default AddDeckPanel;
