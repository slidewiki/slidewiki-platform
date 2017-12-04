import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';

class UserMenu extends React.Component {
    constructor(props){
        super(props);
        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
    }

    render() {
        let decksMsg = 'My Decks';
        let deckGroupsMsg = 'My Deck Groups';

        if(this.props.user.uname !== this.props.loggedinuser){
            decksMsg = 'Owned Decks';
            deckGroupsMsg = 'Owned Deck Groups';
        }

        return (
          <div>
              <div className="ui vertical fluid menu">
                  <NavLink className="item" href={'/user/' + this.props.user.uname } activeStyle={this.styles}>
                      <p><i className="icon open folder"/> {decksMsg}</p>
                  </NavLink>
                  <NavLink className="item" href={'/user/' + this.props.user.uname + '/deckgroups'} activeStyle={this.styles}>
                      <p><i className="icon grid layout"/> {deckGroupsMsg}</p>
                  </NavLink>
              </div>

          </div>
        );
    }
}

UserMenu.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserMenu;
