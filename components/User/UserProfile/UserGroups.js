import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import updateUsergroup from '../../../actions/user/userprofile/updateUsergroup';

class UserGroups extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
    }

    handleClickOnEditGroup(e) {
        e.preventDefault();
        console.log('handleClickOnEditGroup:', e.target.attributes.name.nodeValue);

        const action = e.target.attributes.name.nodeValue;  //eg. changeGroup_2
        const groupid = action.split('_')[1];

        let group = this.props.groups.find((group) => {
            return group._id.toString() === groupid;
        });

        console.log('handleClickOnEditGroup: use group', group);

        this.context.executeAction(updateUsergroup, group);

        this.context.executeAction(navigateAction, {
            url: '/user/' + this.props.username + '/groups/edit'
        });
    }

    handleCLickNewGroup(e) {
        e.preventDefault();
        this.context.executeAction(updateUsergroup, {});
        this.context.executeAction(navigateAction, {
            url: '/user/' + this.props.username + '/groups/edit'
        });
    }

    render() {
        let items = [];
        //TODO groups where not creator -> leave button instead of edit button
        this.props.groups.forEach((group) => {
            items.push( (
                <div key={group._id} className="ui vertical segment" >
                    <div className="ui two column stacakble grid container">

                        <div className="column">
                            <div className="ui header"><h3>{group.name}</h3></div>
                            <div
                                 className="meta">{group.members.length} member{(group.members.length > 1) ? 's': ''}</div>
                        </div>

                        <div className="right aligned column">
                            <button className="ui large basic icon button" data-tooltip="Group settings" aria-label="Group settings" name={'changeGroup_' + group._id} onClick={this.handleClickOnEditGroup.bind(this)} >
                                <i className="setting icon" name={'changeGroup_' + group._id} ></i>
                            </button>

                        </div>
                    </div>
                </div>
            ));
        });

        if (this.props.groups === undefined || this.props.groups === null || this.props.groups.length < 1) {
            items = [(
                <div key="dummy" className="ui vertical segment" >
                  <div className="ui two column stacakble grid container">
                    <h4>Not a member of a group.</h4>
                  </div>
                </div>
            )];
        }

        return (
            <div className="ui segments">
                <div className="ui secondary clearing segment" >
                  <h3 className="ui left floated header" >Groups</h3>
                  <div className="ui right floated labeled icon button" onClick={this.handleCLickNewGroup.bind(this)}>
                      <i className="icon users"/>
                      <p>Create new group</p>
                  </div>
              </div>
              <div className="ui vertical segment">
                  {items}
              </div>
            </div>
        );
    }
}

UserGroups.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserGroups;
