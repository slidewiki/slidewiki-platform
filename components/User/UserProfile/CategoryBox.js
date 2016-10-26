import React from 'react';
import { NavLink } from 'fluxible-router';

class CategoryBox extends React.Component {
    constructor(props){
        super(props);
        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
        this.headerStyle = {'backgroundColor': 'rgb(243, 244, 245)', 'color': 'rgba(0,0,0,.6)'};
    }

    render() {
        return (
          <div ref="menus">

              <div className="ui vertical menu">
                  <div className="item" style={ this.headerStyle }><h3>Personal settings</h3></div>
                  <NavLink className="item" href={'/user/' + this.props.username + '/settings/profile'} activeStyle={this.styles}>
                      <p><i className="icon user"/> Profile</p>
                  </NavLink>
                  <NavLink className="item" href={'/user/' + this.props.username + '/settings/account'} activeStyle={this.styles}>
                      <p><i className="icon lock"/> Account</p>
                  </NavLink>
                  <NavLink className="item" href={'/user/' + this.props.username + '/settings/integrations'} activeStyle={this.styles}>
                      <p><i className="icon cloud"/> Authorized Accounts</p>
                  </NavLink>
              </div>

              <div className="ui vertical pointing menu">
                  <div className="item" style={ this.headerStyle }><h3>Groups</h3></div>
                  <NavLink className="item" href={'/user/' + this.props.username + '/groups/overview'} activeStyle={this.styles}>
                      <p><i className="icon users"/> My Groups</p>
                  </NavLink>
              </div>

          </div>
        );
    }
}

CategoryBox.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default CategoryBox;
