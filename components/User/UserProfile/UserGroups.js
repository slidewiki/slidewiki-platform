import PropTypes from 'prop-types';
import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import updateUsergroup from '../../../actions/user/userprofile/updateUsergroup';
import deleteUsergroup from '../../../actions/user/userprofile/deleteUsergroup';
import leaveUsergroup from '../../../actions/user/userprofile/leaveUsergroup';
import { FormattedMessage, defineMessages } from 'react-intl';

class UserGroups extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};

        this.messages = defineMessages({
            error: {
                id: 'UserGroups.error',
                defaultMessage: 'Error',
            },
            unknownError: {
                id: 'UserGroups.unknownError',
                defaultMessage: 'Unknown error while saving.',
            },
            close: {
                id: 'UserGroups.close',
                defaultMessage: 'Close',
            },
            msgError: {
                id: 'UserGroups.msgError',
                defaultMessage: 'Error while deleting the group',
            },
            msgErrorLeaving: {
                id: 'UserGroups.msgErrorLeaving',
                defaultMessage: 'Error while leaving the group',
            },
            member: {
                id: 'UserGroups.member',
                defaultMessage: 'member',
            },
            members: {
                id: 'UserGroups.members',
                defaultMessage: 'members',
            },
            groupDeletion: {
                id: 'UserGroups.groupDeletion',
                defaultMessage: 'Group deletion',
            },
            groupSettings: {
                id: 'UserGroups.groupSettings',
                defaultMessage: 'Group settings',
            },
            groupLeave: {
                id: 'UserGroups.groupLeave',
                defaultMessage: 'Leave group',
            },
            notAGroupmember: {
                id: 'UserGroups.notAGroupmember',
                defaultMessage: 'Not a member of a group.',
            },
            loading: {
                id: 'UserGroups.loading',
                defaultMessage: 'Loading',
            },
            groups: {
                id: 'UserGroups.groups',
                defaultMessage: 'Groups',
            },
            createGroup: {
                id: 'UserGroups.createGroup',
                defaultMessage: 'Create new group',
            },
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error.action !== undefined && this.props.error === '') {
            let message = this.context.intl.formatMessage(this.messages.error) + ': ';
            if (nextProps.error.action === 'leave')
                message = this.context.intl.formatMessage(this.messages.msgErrorLeaving) + ': ';
            swal({
                title: this.context.intl.formatMessage(this.messages.error),
                text: message + nextProps.error.message,
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(this.messages.close),
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
        // console.log('handleClickOnEditGroup:', e.target.attributes.name.value);

        const action = e.target.attributes.name.value;  //eg. changeGroup_2
        const groupid = action.split('_')[1];

        let group = this.props.groups.find((group) => {
            return group._id.toString() === groupid;
        });

        // console.log('handleClickOnEditGroup: use group', group);

        this.context.executeAction(updateUsergroup, {group: group, offline: false});

        this.context.executeAction(navigateAction, {
            url: '/user/' + this.props.username + '/groups/edit'
        });
    }

    handleClickOnRemoveGroup(e) {
        e.preventDefault();
        console.log('handleClickOnRemoveGroup:', e.target.attributes.name.value);

        const action = e.target.attributes.name.value;  //eg. changeGroup_2
        const groupid = action.split('_')[1];

        swal({
            titleText: 'Are you sure you want to delete this user group?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((accepted) => {
            this.context.executeAction(deleteUsergroup, {groupid: groupid});
            swal('User group successfully deleted');
        }, (cancelled) => {/*do nothing*/})
            .catch(swal.noop);
    }

    handleClickOnLeaveGroup(e) {
        e.preventDefault();
        console.log('handleClickOnLeaveGroup:', e.target.attributes.name.value);

        const action = e.target.attributes.name.value;  //eg. changeGroup_2
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
                    <div className="ui two column grid container">

                        <div className="column">
                            <div className="ui header"><h3>{group.name}</h3></div>
                            <div
                                 className="meta">{group.members.length+1} {this.context.intl.formatMessage(((group.members.length+1) !== 1) ? this.messages.members : this.messages.member)}</div>
                        </div>

                        <div className="right aligned column">
                            {((this.props.userid === group.creator) || (this.props.userid === group.creator.userid)) ? (
                              <div>
                                  <button className="ui large basic icon button"
                                      data-tooltip={this.context.intl.formatMessage(this.messages.groupDeletion)}
                                      aria-label={this.context.intl.formatMessage(this.messages.groupDeletion)}
                                      name={'deleteGroup_' + group._id}
                                      onClick={this.handleClickOnRemoveGroup.bind(this)} >
                                    <i className="remove icon" name={'deleteGroup_' + group._id} ></i>
                                  </button>
                                  <button className="ui large basic icon button"
                                      data-tooltip={this.context.intl.formatMessage(this.messages.groupSettings)}
                                      aria-label={this.context.intl.formatMessage(this.messages.groupSettings)}
                                      name={'changeGroup_' + group._id}
                                      onClick={this.handleClickOnEditGroup.bind(this)} >
                                    <i className="setting icon" name={'changeGroup_' + group._id} ></i>
                                  </button>
                              </div>
                            ) : (
                              <button className="ui large basic icon button"
                                  data-tooltip={this.context.intl.formatMessage(this.messages.groupLeave)}
                                  aria-label={this.context.intl.formatMessage(this.messages.groupLeave)}
                                  name={'leaveGroup_' + group._id}
                                  onClick={this.handleClickOnLeaveGroup.bind(this)} >
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
                    <h4>{this.context.intl.formatMessage(this.messages.notAGroupmember)}</h4>
                  </div>
                </div>
            )];
        }

        return (
            <div className="ui segments">
                <div className="ui secondary clearing segment" >
                  <h3 className="ui left floated header" >{this.context.intl.formatMessage(this.messages.groups)}</h3>
                  <button className="ui right floated labeled icon button" role="button" tabIndex="0" onClick={this.handleCLickNewGroup.bind(this)}>
                      <i className="icon users"/>
                      <p>{this.context.intl.formatMessage(this.messages.createGroup)}</p>
                  </button>
              </div>

              {(this.props.status === 'pending') ? <div className="ui active dimmer"><div className="ui text loader">{this.context.intl.formatMessage(this.messages.loading)}</div></div> : ''}

              {items}
            </div>
        );
    }
}

UserGroups.contextTypes = {
    executeAction: PropTypes.func.isRequired
    intl: React.PropTypes.object.isRequired
};

export default UserGroups;
