import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'fluxible-router';
import { FormattedMessage, defineMessages } from 'react-intl';

class CategoryBox extends React.Component {
    constructor(props){
        super(props);
        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
        this.headerStyle = {'backgroundColor': 'rgb(243, 244, 245)', 'color': 'rgba(0,0,0,.6)'};

        this.messages = defineMessages({
            personalSettings: {
                id: 'CategoryBox.personalSettings',
                defaultMessage: 'Personal settings',
            },
            profile: {
                id: 'CategoryBox.profile',
                defaultMessage: ' Profile',
            },
            account: {
                id: 'CategoryBox.account',
                defaultMessage: ' Account',
            },
            authorizedAccounts: {
                id: 'CategoryBox.authorizedAccounts',
                defaultMessage: ' Authorized Accounts',
            },
            groups: {
                id: 'CategoryBox.groups',
                defaultMessage: 'Groups',
            },
            myGroups: {
                id: 'CategoryBox.myGroups',
                defaultMessage: ' My Groups'
            }
        });
    }

    render() {
        return (
          <div ref="menus">

            <div className="ui vertical fluid menu">
              <div className="item" style={ this.headerStyle }>
                <h3>
                  {this.context.intl.formatMessage(this.messages.personalSettings)}
                </h3>
              </div>
              <NavLink className="item" href={'/user/' + this.props.username + '/settings/profile'} activeStyle={this.styles}>
                <p>
                  <i className="icon user"/>
                  {this.context.intl.formatMessage(this.messages.profile)}
                </p>
              </NavLink>
              <NavLink className="item" href={'/user/' + this.props.username + '/settings/account'} activeStyle={this.styles}>
                <p>
                  <i className="icon lock"/>
                  {this.context.intl.formatMessage(this.messages.account)}
                </p>
              </NavLink>
              <NavLink className="item" href={'/user/' + this.props.username + '/settings/integrations'} activeStyle={this.styles}>
                <p>
                  <i className="icon cloud"/>
                  {this.context.intl.formatMessage(this.messages.authorizedAccounts)}
                </p>
              </NavLink>
            </div>

            <div className="ui vertical fluid menu">
              <div className="item" style={ this.headerStyle }>
                <h3>
                  {this.context.intl.formatMessage(this.messages.groups)}
                </h3>
              </div>
              <NavLink className="item" href={'/user/' + this.props.username + '/groups/overview'} activeStyle={this.styles}>
                <p>
                  <i className="icon users"/>
                  {this.context.intl.formatMessage(this.messages.myGroups)}
                </p>
              </NavLink>
            </div>

          </div>
        );
    }
}

CategoryBox.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

export default CategoryBox;
