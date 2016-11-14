import React from 'react';
import { NavLink } from 'fluxible-router';

class UserGroups extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
    }

    handleClickOnEditGroup(e) {
        e.preventDefault();
    }

    render() {
        let items = '';
        this.props.groups.forEach((group) => {
            items += (
                <div className="item">
                  <div className="content">
                    <div className="header">{group.name}</div>
                    {group.members.length} members
                  </div>
                  <img className="icon settings" name={'changeGroup_' + group.id} onClick={this.handleClickOnEditGroup.bind(this)} />
                </div>
            );
        });

        let list = (
          <div className="ui celled list">
            {items}
          </div>
        );

        if (this.props.groups === undefined || this.props.groups === null || this.props.groups.length < 1) {
            list = (
              <h4>Not a member of a group.</h4>
            );
        }

        return (
            <div className="ui segments">
                <div className="ui secondary clearing segment" >
                  <h3 className="ui left floated header" >Groups</h3>
                  <NavLink className="ui right floated labeled icon button" href={'/user/' + this.props.username + '/groups/edit'} activeStyle={this.styles}>
                      <i className="icon users"/>
                      <p>Create new group</p>
                  </NavLink>
              </div>
              <div className="ui segment">
                  {list}
              </div>
            </div>
        );
    }
}

UserGroups.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserGroups;
