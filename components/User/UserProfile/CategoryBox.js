import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'fluxible-router';
import { FormattedMessage, defineMessages } from 'react-intl';

import UserProfileStore from '../../../stores/UserProfileStore';
import fetchUser from '../../../actions/user/userprofile/fetchUser';

class CategoryBox extends React.Component {
    constructor(props){
        super(props);
        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
        this.headerStyle = {'backgroundColor': 'rgb(243, 244, 245)', 'color': 'rgba(0,0,0,.6)'};
    }

    componentDidMount(){
      //if(this.props.UserProfileStore === undefined)
        //console.log("CategoryBox.this.props.UserProfileStore="+this.props.UserProfileStore);
        //if(this.props.UserProfileStore.userpicture === undefined)
      //this.context.executeAction(fetchUser,{ params: {username: this.props.UserProfileStore.username}, onlyPicture: true});
    }
    render() {
    //if (this.props.UserProfileStore.user.email != 'temp@temp.com')
      {
        return (
          <div ref="menus">

            <div className="ui vertical fluid menu">
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

            <div className="ui vertical fluid menu">
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


            <div className="ui vertical fluid menu">
              <div className="item" style={ this.headerStyle }>
                <h3>
                  <FormattedMessage
                    id='CategoryBox.ltis'
                    defaultMessage='LTIs'
                  />
                </h3>
              </div>
              <NavLink className="item" href={'/user/' + this.props.username + '/ltis/overview'} activeStyle={this.styles}>
                <p>
                  <i className="icon users"/>
                  <FormattedMessage
                    id='CategoryBox.myLTIs'
                    defaultMessage=' My LTIs'
                  />
                </p>
              </NavLink>
            </div>

          </div>
        );
      }//end
      /*
      else{
        return (
          <div ref="menus">

            <div className="ui vertical fluid menu">
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

            <div className="ui vertical fluid menu">
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

          </div>
        );

      }//end else
      */
    }
}

CategoryBox.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default CategoryBox;
