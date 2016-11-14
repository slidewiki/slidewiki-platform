import React from 'react';
import { NavLink } from 'fluxible-router';

class UserGroupEdit extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
    }

    handleClickOnEditGroup(e) {
        e.preventDefault();
    }

    render() {
        const signUpLabelStyle = {width: '150px'};

        //TODO change header depending on group should created or changed
        return (
            <div className="ui segments">
                <div className="ui secondary clearing segment" >
                  <h3 className="ui left floated header" >Edit Group</h3>
              </div>
              <div className="ui segment">
              <form className="ui usergroupedit form" >
                  <div className="ui inline field">
                      <label style={signUpLabelStyle}>Group name * </label>
                      <div className="ui icon input"><input type="text" name="groupname" ref="groupname" placeholder="Group name" autoFocus aria-required="true"/></div>
                  </div>
                  <div className="ui inline field">
                      <label style={signUpLabelStyle}>Description </label>
                      <div className="ui icon input"><input type="textarea" name="description" ref="description" placeholder="Description of the group" aria-required="true"/></div>
                  </div>
                  <div className="ui error message"></div>
                  <button type="submit" className="ui blue labeled submit icon button" >
                      <i className="icon add user"/> Save group
                  </button>
              </form>
              </div>
            </div>
        );
    }
}

UserGroupEdit.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserGroupEdit;
