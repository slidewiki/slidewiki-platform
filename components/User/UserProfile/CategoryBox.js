import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'fluxible-router';
import {Microservices} from '../../../configs/microservices';
import { FormattedMessage, defineMessages } from 'react-intl';
import { LTI_ID } from '../../../configs/general';

class CategoryBox extends React.Component {
    constructor(props){
        super(props);
        this.styles = {'backgroundColor': '#1e78bb', 'color': 'white'};
        this.headerStyle = {'backgroundColor': 'rgb(243, 244, 245)', 'color': 'rgba(0,0,0,.6)'};
    }

    render() {
        let analyticsDiv = ((Microservices.analytics) ? (
            <div className="ui vertical fluid menu">
              <div className="item" style={ this.headerStyle }>
                <h3>
                  <FormattedMessage
                    id='CategoryBox.analytics'
                    defaultMessage='Analytics'
                  />
                  <span className="ui top right attached icon label">
                    <i className="warning yellow sign icon"/>Beta
                  </span>
                </h3>
              </div>
              <NavLink className="item" href={'/user/' + this.props.username + '/analytics/performanceprediction'} activeStyle={this.styles}>
                <p>
                  <i className="icon chart bar"/>
                  <FormattedMessage
                    id='CategoryBox.PerformancePrediction'
                    defaultMessage='Performance Prediction'
                  />
                </p>
              </NavLink>
            </div>) : '');

        //console.log('CategoryBox.props.username='+this.props.username);

        return (
          <div ref="menus">

            <div className="ui vertical fluid menu">
              <div className="item" style={ this.headerStyle }>
                <h2 id="navigation">
                  <FormattedMessage
                    id='CategoryBox.personalSettings'
                    defaultMessage='Personal settings'
                  />
                </h2>
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
                    defaultMessage=' Accounts'
                  />
                </p>
              </NavLink>
              <NavLink className="item" href={'/user/' + this.props.username + '/settings/integrations'} activeStyle={this.styles}>
                <p>
                  <i className="icon cloud"/>
                  <FormattedMessage
                    id='CategoryBox.authorizedAccounts'
                    defaultMessage=' Authorized Accounts & Services'
                  />
                </p>
              </NavLink>
                <NavLink className="item" href={'/user/' + this.props.username + '/stats'} activeStyle={this.styles}>
                    <p>
                        <i className="icon line graph"/>
                        <FormattedMessage
                          id='CategoryBox.userStats'
                          defaultMessage='User Stats'
                        />
                    </p>
                </NavLink>
            </div>

            <div className="ui vertical fluid menu">
              <div className="item" style={ this.headerStyle }>
                <h2>
                  <FormattedMessage
                    id='CategoryBox.groups'
                    defaultMessage='Groups'
                  />
                </h2>
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

            {analyticsDiv}

          </div>
        );
    }
}

CategoryBox.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default CategoryBox;
