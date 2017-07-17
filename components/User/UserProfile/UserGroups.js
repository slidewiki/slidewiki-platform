import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import updateUsergroup from '../../../actions/user/userprofile/updateUsergroup';
import deleteUsergroup from '../../../actions/user/userprofile/deleteUsergroup';
import leaveUsergroup from '../../../actions/user/userprofile/leaveUsergroup';

class UserGroups extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error.action !== undefined && this.props.error === '') {
            let message = 'Error while deleting the group: ';
            if (nextProps.error.action === 'leave')
                message = 'Error while leaving the group: ';
            swal({
                title: 'Error',
                text: message + nextProps.error.message,
                type: 'error',
                confirmButtonText: 'Close',
                confirmButtonClass: 'negative ui button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            })
            .then(() => {
                this.context.executeAction(updateUsergroup, {group: {}, offline: true});

                return true;
            })
            .catch();
            return;
        }
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

        this.context.executeAction(updateUsergroup, {group: group, offline: false});

        this.context.executeAction(navigateAction, {
            url: '/user/' + this.props.username + '/groups/edit'
        });
    }

    handleClickOnRemoveGroup(e) {
        e.preventDefault();
        console.log('handleClickOnRemoveGroup:', e.target.attributes.name.nodeValue);

        const action = e.target.attributes.name.nodeValue;  //eg. changeGroup_2
        const groupid = action.split('_')[1];

        this.context.executeAction(deleteUsergroup, {groupid: groupid});
    }

    handleClickOnLeaveGroup(e) {
        e.preventDefault();
        console.log('handleClickOnLeaveGroup:', e.target.attributes.name.nodeValue);

        const action = e.target.attributes.name.nodeValue;  //eg. changeGroup_2
        const groupid = action.split('_')[1];

        this.context.executeAction(leaveUsergroup, {groupid: groupid});
    }

    handleCLickNewGroup(e) {
        e.preventDefault();
        this.context.executeAction(updateUsergroup, {group: {}, offline: true});
        this.context.executeAction(navigateAction, {
            url: '/user/' + this.props.username + '/groups/edit'
        });
    }

    render() {
        let items = [];
        // console.log('render userGroups:', this.props.userid, this.props.groups);
        this.props.groups.forEach((group) => {
            items.push( (
                <div key={group._id} className="ui vertical segment" >
                    <div className="ui two column stackable grid container">

                        <div className="column">
                            <div className="ui header"><h3>{group.name}</h3></div>
                            <div
                                 className="meta">{group.members.length+1} member{((group.members.length+1) !== 1) ? 's': ''}</div>
                        </div>

                        <div className="right aligned column">
                            {((this.props.userid === group.creator) || (this.props.userid === group.creator.userid)) ? (
                              <div>
                                  <button className="ui large basic icon button" data-tooltip="Group deletion" aria-label="Group deletion" name={'deleteGroup_' + group._id} onClick={this.handleClickOnRemoveGroup.bind(this)} >
                                      <i className="remove icon" name={'deleteGroup_' + group._id} ></i>
                                  </button>
                                  <button className="ui large basic icon button" data-tooltip="Group settings" aria-label="Group settings" name={'changeGroup_' + group._id} onClick={this.handleClickOnEditGroup.bind(this)} >
                                      <i className="setting icon" name={'changeGroup_' + group._id} ></i>
                                  </button>
                              </div>
                            ) : (
                              <button className="ui large basic icon button" data-tooltip="Leave group" aria-label="Leave group" name={'leaveGroup_' + group._id} onClick={this.handleClickOnLeaveGroup.bind(this)} >
                                  <i className="remove icon" name={'leaveGroup_' + group._id} ></i>
                              </button>
                            )}

                        </div>
                    </div>
                </div>
            ));
        });

        if (this.props.groups === undefined || this.props.groups === null || this.props.groups.length < 1) {
            items = [(
                <div key="dummy" className="ui vertical segment" >
                  <div className="ui two column stackable grid container">
                    <h4>Not a member of a group.</h4>
                  </div>
                </div>
            )];
        }

        return (
            <div className="ui segments">
                <div className="ui secondary clearing segment" >
                  <h3 className="ui left floated header" >Groups</h3>
                  <button className="ui right floated labeled icon button" role="button" tabIndex="0" onClick={this.handleCLickNewGroup.bind(this)}>
                      <i className="icon users"/>
                      <p>Create new group</p>
                  </button>
              </div>

              {(this.props.status === 'pending') ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}

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
