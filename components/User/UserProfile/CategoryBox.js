import React from 'react';
import { NavLink } from 'fluxible-router';
import { FormattedMessage, defineMessages } from 'react-intl';

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
              <div className="item" style={ this.headerStyle }>
                <h3>
                  <FormattedMessage
                    id='CategoryBox.personalSettings'
                    defaultMessage='Personal settings'
                  />
                </h3>
              </div>
              <NavLink className="item" href={'/user/' + this.props.username + '/settings/profile'} activeStyle={this.styles}>
                <p>
                  <i className="icon user"/>
                  <FormattedMessage
                    id='CategoryBox.profile'
                    defaultMessage=' Profile'
                  />
                </p>
              </NavLink>
              <NavLink className="item" href={'/user/' + this.props.username + '/settings/account'} activeStyle={this.styles}>
                <p>
                  <i className="icon lock"/>
                  <FormattedMessage
                    id='CategoryBox.account'
                    defaultMessage=' Account'
                  />
                </p>
              </NavLink>
              <NavLink className="item" href={'/user/' + this.props.username + '/settings/integrations'} activeStyle={this.styles}>
                <p>
                  <i className="icon cloud"/>
                  <FormattedMessage
                    id='CategoryBox.authorizedAccounts'
                    defaultMessage=' Authorized Accounts'
                  />
                </p>
              </NavLink>
            </div>

            <div className="ui vertical menu">
              <div className="item" style={ this.headerStyle }>
                <h3>
                  <FormattedMessage
                    id='CategoryBox.groups'
                    defaultMessage='Groups'
                  />
                </h3>
              </div>
              <NavLink className="item" href={'/user/' + this.props.username + '/groups/overview'} activeStyle={this.styles}>
                <p>
                  <i className="icon users"/>
                  <FormattedMessage
                    id='CategoryBox.myGroups'
                    defaultMessage=' My Groups'
                  />
                </p>
              </NavLink>
            </div>

            <div className="ui vertical menu">
              <div className="item" style={ this.headerStyle }>
                <h3>
                  <FormattedMessage
                    id='CategoryBox.analytics'
                    defaultMessage='Analytics'
                  />
                </h3>
              </div>
              <NavLink className="item" href={'/user/' + this.props.username + '/analytics/performanceprediction'} activeStyle={this.styles}>
                <p>
                  <i className="icon users"/>
                  <FormattedMessage
                    id='CategoryBox.myAnalytics'
                    defaultMessage=' My Analytics'
                  />
                </p>
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
