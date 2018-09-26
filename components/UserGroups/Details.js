import PropTypes from 'prop-types';
import React from 'react';
import { Microservices } from '../../configs/microservices';
import { TextArea } from 'semantic-ui-react';
import { timeSince } from '../../common';
import UserPicture from '../common/UserPicture';
import updateUsergroup from '../../actions/usergroups/updateUsergroup';
import saveUsergroup from '../../actions/usergroups/saveUsergroup';
import { FormattedMessage, defineMessages } from 'react-intl';
import deleteUsergroup from '../../actions/usergroups/deleteUsergroup';
import leaveUsergroup from '../../actions/usergroups/leaveUsergroup';

class Details extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};

        this.messages = defineMessages({
            error: {
                id: 'UserGroupEdit.error',
                defaultMessage: 'Error',
            },
            unknownError: {
                id: 'UserGroupEdit.unknownError',
                defaultMessage: 'Unknown error while saving.',
            },
            close: {
                id: 'UserGroupEdit.close',
                defaultMessage: 'Close',
            },
            messageGroupName: {
                id: 'UserGroupEdit.messageGroupName',
                defaultMessage: 'At least you have to give the group a name.',
            },
            createGroup: {
                id: 'UserGroupEdit.createGroup',
                defaultMessage: 'Create Group',
            },
            editGroup: {
                id: 'UserGroupEdit.editGroup',
                defaultMessage: 'Edit Group',
            },
            messageUsericon: {
                id: 'UserGroupEdit.messageUsericon',
                defaultMessage: 'The username is a link which will open a new browser tab. Close it when you want to go back to the form and list.',
            },
            groupOwner: {
                id: 'UserGroupEdit.groupOwner',
                defaultMessage: 'Group owner',
            },
            unknownOrganization: {
                id: 'UserGroupEdit.unknownOrganization',
                defaultMessage: 'Unknown organization',
            },
            unknownCountry: {
                id: 'UserGroupEdit.unknownCountry',
                defaultMessage: 'unknown country',
            },
            groupName: {
                id: 'UserGroupEdit.groupName',
                defaultMessage: 'Group Name',
            },
            description: {
                id: 'UserGroupEdit.description',
                defaultMessage: 'Description',
            },
            addUser: {
                id: 'UserGroupEdit.addUser',
                defaultMessage: 'Add user',
            },
            saveGroup: {
                id: 'UserGroupEdit.saveGroup',
                defaultMessage: 'Save group',
            },
            deleteGroup: {
                id: 'UserGroupEdit.deleteGroup',
                defaultMessage: 'Delete Group',
            },
            leaveGroup: {
                id: 'UserGroupEdit.leaveGroup',
                defaultMessage: 'Leave group',
            },
            loading: {
                id: 'UserGroupEdit.loading',
                defaultMessage: 'Loading',
            },
            members: {
                id: 'UserGroupEdit.members',
                defaultMessage: 'Members',
            },
        });
    }

    componentDidUpdate() {
        // console.log('UserGroupEdit componentDidUpdate:', this.props.saveUsergroupError, this.props.currentUsergroup);
        if (this.props.saveUsergroupError) {
            swal({
                title: this.context.intl.formatMessage(this.messages.error),
                text: this.context.intl.formatMessage(this.messages.unknownError),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(this.messages.close),
                confirmButtonClass: 'negative ui button',
                allowEscapeKey: true,
                allowOutsideClick: true,
                buttonsStyling: false
            })
            .then(() => {
                return true;
            })
            .catch();
            return;
        }
        try {
            this.refs.GroupName.value = this.props.currentUsergroup.name || '';
            this.refs.GroupDescription.value = this.props.currentUsergroup.description || '';
        } catch (error) {

        }
    }

    componentDidMount() {
        console.log('Details componentDidMount');
        $('#usergoup_edit_dropdown_usernames_remote')
            .dropdown({
                apiSettings: {
                    url: Microservices.user.uri + '/information/username/search/{query}',
                    cache: false
                },
                saveRemoteData: false,
                action: (name, value, source) => {
                    // console.log('dropdown select', name, value, source);

                    $('#usergoup_edit_dropdown_usernames_remote').dropdown('clear');
                    $('#usergoup_edit_dropdown_usernames_remote').dropdown('hide');

                    let group = this.getGroup(this.props.currentUsergroup.members);
                    if (group.members === undefined || group.members === null)
                        group.members = [];

                    let data = JSON.parse(decodeURIComponent(value));
                    //console.log('trying to add', name, 'to', group.members, ' with ', data);
                    if (group.members.findIndex((member) => {
                        return member.userid === parseInt(data.userid);
                    }) === -1 && data.username !== this.props.username) {
                        group.members.push({
                            username: data.username,
                            userid: parseInt(data.userid),
                            joined: data.joined || undefined,
                            picture: data.picture,
                            country: data.country,
                            organization: data.organization,
                            displayName: data.displayName
                        });
                    }

                    this.context.executeAction(updateUsergroup, {group: group, offline: true});

                    return true;
                }
            });
    }

    getGroup(members = undefined) {
        let group = {};
        try {
            group = {
                _id: this.props.currentUsergroup._id,
                name: this.refs.GroupName.value,
                description: this.refs.GroupDescription.value,
                members: members,
                timestamp: this.props.currentUsergroup.timestamp || '',
                creator: this.props.currentUsergroup.creator || this.props.userid
            };
        } catch (error) {

        }

        if (this.props.currentUsergroup._id)
            group.id = group._id;

        //TODO get members from list

        return group;
    }

    handleSave(e) {
        e.preventDefault();

        let group = this.getGroup(this.props.currentUsergroup.members);

        //console.log('handleSave:', group);

        if (group.name === '') {
            swal({
                title: this.context.intl.formatMessage(this.messages.error),
                text: this.context.intl.formatMessage(this.messages.messageGroupName),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(this.messages.close),
                confirmButtonClass: 'negative ui button',
                allowEscapeKey: true,
                allowOutsideClick: true,
                buttonsStyling: false
            })
            .then(() => {
                return true;
            })
            .catch();
            return;
        }

        this.context.executeAction(saveUsergroup, group);
    }

    handleExitGroup(e) {
        e.preventDefault();
        console.log('handleExitGroup:', e.target.attributes.name.value);

        const action = e.target.attributes.name.value;  //eg. changeGroup_2
        const groupid = action.split('_')[1];

        if (this.props.isCreator) {//remove
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
        else {//leave
            swal({
                titleText: 'Are you sure you want to leave this user group?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, remove me'
            }).then((accepted) => {
                this.context.executeAction(leaveUsergroup, {groupid: groupid});
                swal('User group successfully removed you');
            }, (cancelled) => {/*do nothing*/})
                .catch(swal.noop);
        }
    }

    handleClickRemoveMember(member) {
        // console.log('handleClickRemoveMember', member, 'from', this.props.currentUsergroup.members);

        let group = this.getGroup(this.props.currentUsergroup.members);

        group.members = group.members.filter((gmember) => {
            return gmember.userid !== member.userid;
        });

        this.context.executeAction(updateUsergroup, {group: group, offline: true});
    }

    render() {
        if (!this.props.currentUsergroup || !this.props.currentUsergroup.creator || !this.props.currentUsergroup.creator.userid)
            return null;

        let userlist = [];
        //add creator as default member
        userlist.push(
          <div className="item" key={this.props.currentUsergroup.creator.userid}>
            <div className="ui grid">
              <div className="one wide column middle aligned">
                <UserPicture picture={ this.props.currentUsergroup.creator.picture } username={ this.props.currentUsergroup.creator.username } avatar={ true } width= { 24 } />
              </div>
              <div className="fourteen wide column">
                <div className="content">
                    <TextArea className="sr-only" id={'usernameIsALinkHint' + this.props.currentUsergroup.creator.userid} value={this.context.intl.formatMessage(this.messages.messageUsericon)} tabIndex ='-1'/>
                    <a className="header" href={'/user/' + this.props.currentUsergroup.creator.username} target="_blank">{this.props.currentUsergroup.creator.displayName || this.props.currentUsergroup.creator.username}</a>
                    <div className="description">{this.context.intl.formatMessage(this.messages.groupOwner)}</div>
                </div>
              </div>
            </div>
          </div>
        );

        // console.log('render UserGroupEdit:', this.props.currentUsergroup.members);
        if (this.props.currentUsergroup.members !== undefined && this.props.currentUsergroup.members.length > 0) {
            this.props.currentUsergroup.members.forEach((member) => {
                let fct = () => {
                    this.handleClickRemoveMember(member);
                };
                let optionalElement = (member.organization || member.country) ?  (
                  <div>
                    {member.organization || this.context.intl.formatMessage(this.messages.unknownOrganization)} ({member.country || this.context.intl.formatMessage(this.messages.unknownCountry)})
                    <br/>
                  </div>
                ) : '';
                let localMessages = defineMessages({
                    joined: {
                        id: 'UserGroupEdit.joined',
                        defaultMessage: 'Joined {time} ago',
                    }
                });
                let optionalText = (member.joined) ? this.context.intl.formatMessage(localMessages.joined, {time: timeSince((new Date(member.joined)))}) : '';
                userlist.push(
                  (
                    <div className="item" key={member.userid}>
                      <div className="ui grid">
                        <div className="one wide column middle aligned">
                          <UserPicture picture={ member.picture } username={ member.username } avatar={ true } width= { 24 } />
                        </div>
                        <div className="fourteen wide column">
                          <div className="content">
                              <TextArea className="sr-only" id={'usernameIsALinkHint' + member.userid} value={this.context.intl.formatMessage(this.messages.messageUsericon)} tabIndex ='-1'/>
                              <a className="header" href={'/user/' + member.username} target="_blank">{member.displayName || member.username}</a>
                              <div className="description">{optionalElement}{optionalText}</div>
                          </div>
                        </div>
                        <div className="one wide column middle aligned">
                          <button className="ui basic icon button" data-tooltip="Remove group member" aria-label="remove group member">
                            <i className="remove middle aligned icon" key={member.userid} onClick={fct}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                );
            });
        }

        return (
            <div className="ui container">
                <div className="ui two column vertically padded grid container">
                    <div className="ui container">
                        <form className="ui form">
                            <div className="field" data-tooltip={this.context.intl.formatMessage(this.messages.groupName)} >
                                <label htmlFor="usergroupedit_input_GroupName">
                                    {this.context.intl.formatMessage(this.messages.groupName)}
                                </label>
                                <input type="text" placeholder="Name" id="usergroupedit_input_GroupName" name="GroupName" ref="GroupName" aria-labelledby="GroupName" aria-required="true" defaultValue={this.props.currentUsergroup.name || ''}  />
                            </div>

                            <div className="field">
                                <label htmlFor="usergroupedit_input_GroupDescription">{this.context.intl.formatMessage(this.messages.description)}</label>
                                <textarea rows="4" aria-labelledby="GroupDescription" id="usergroupedit_input_GroupDescription" name="GroupDescription" ref="GroupDescription" defaultValue={this.props.currentUsergroup.description || ''} ></textarea>
                            </div>
                            <div className="field">
                                <label htmlFor="usergroupedit_input_AddUserGr">{this.context.intl.formatMessage(this.messages.addUser)}</label>
                                <select className="ui search dropdown" aria-labelledby="AddUserGr" id="usergroupedit_input_AddUserGr" name="AddUserGr" ref="AddUserGr" id="usergoup_edit_dropdown_usernames_remote">
                                </select>
                            </div>
                        </form>
                        <div className="ui hidden divider">
                        </div>
                        <div className="ui buttons">
                            <button className="ui blue labeled submit icon button" onClick={this.handleSave.bind(this)} >
                                <i className="save icon"></i>{this.context.intl.formatMessage(this.messages.saveGroup)}
                            </button>

                            {(this.props.userid && (this.props.isMember || this.props.isCreator)) ?
                                <button className="ui labeled icon button" onClick={this.handleExitGroup.bind(this)} >
                                    <i className="remove icon"></i>{this.props.isCreator ?
                                        this.context.intl.formatMessage(this.messages.deleteGroup)
                                        : this.context.intl.formatMessage(this.messages.leaveGroup)}
                                </button>
                            : ''}
                        </div>
                        {(this.props.saveUsergroupIsLoading === true) ? <div className="ui active dimmer"><div className="ui text loader">{this.context.intl.formatMessage(this.messages.loading)}</div></div> : ''}

                        <div className="ui hidden divider">
                        </div>

                        <div className="ui header">
                            <h3>{this.context.intl.formatMessage(this.messages.members)}</h3>
                        </div>
                        <div className="ui relaxed divided list">
                            {userlist}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Details.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

export default Details;
