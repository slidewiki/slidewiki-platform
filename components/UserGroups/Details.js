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
import ChangePicture from './ChangePicture';

class Details extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
        this.hasChanges = false;

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
                defaultMessage: 'Group name required.',
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
                defaultMessage: 'Unknown country',
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
                defaultMessage: 'Save Group',
            },
            deleteGroup: {
                id: 'UserGroupEdit.deleteGroup',
                defaultMessage: 'Delete Group',
            },
            leaveGroup: {
                id: 'UserGroupEdit.leaveGroup',
                defaultMessage: 'Leave Group',
            },
            loading: {
                id: 'UserGroupEdit.loading',
                defaultMessage: 'Loading',
            },
            members: {
                id: 'UserGroupEdit.members',
                defaultMessage: 'Members',
            },
            details: {
                id: 'UserGroupEdit.details',
                defaultMessage: 'Group details',
            },
        });

        this.initialize = this.initialize.bind(this);
    }

    componentDidMount() {
        this.initialize();
    }

    componentDidUpdate() {
        this.initialize();
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

    //inititalize drowdown and windowbeforeunload
    initialize() {
        // console.log('Details componentDidMount');
        let that = this;
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

                        that.hasChanges = true;
                    }

                    this.context.executeAction(updateUsergroup, {group: group, offline: true});

                    return true;
                }
            });

        window.onbeforeunload = () => {
            if (this.hasChanges === true)
            {
                const messagesUnsavedChangesAlert = defineMessages({
                    alert:{
                        id: 'UserGroupEdit.unsavedChangesAlert',
                        defaultMessage: 'You have unsaved changes. If you do not save the group, it will not be updated. Are you sure you want to exit this page?'
                    }
                });
                return this.context.intl.formatMessage(messagesUnsavedChangesAlert.alert);
            }
        };
    }

    componentWillreceiveProps(nextprops) {
        if (nextprops.UserGroupsStore.errorMessage !== this.props.UserGroupsStore.errorMessage && nextprops.UserGroupsStore.errorMessage) {
            swal({
                title: this.context.intl.formatMessage(this.messages.error),
                text: nextprops.UserGroupsStore.errorMessage,
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
        }
        else if (nextprops.UserGroupsStore.deleteUsergroupError !== this.props.UserGroupsStore.deleteUsergroupError && nextprops.UserGroupsStore.deleteUsergroupError) {
            swal({
                title: this.context.intl.formatMessage(this.messages.error),
                text: nextprops.UserGroupsStore.deleteUsergroupError,
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
        }
        else if (nextprops.UserGroupsStore.leaveUsergroupError !== this.props.UserGroupsStore.leaveUsergroupError && nextprops.UserGroupsStore.leaveUsergroupError) {
            swal({
                title: this.context.intl.formatMessage(this.messages.error),
                text: nextprops.UserGroupsStore.leaveUsergroupError,
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
        }
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
                creator: this.props.currentUsergroup.creator || this.props.userid,
                picture: this.props.currentUsergroup.picture
            };
        } catch (error) {

        }

        if (this.props.currentUsergroup._id)
            group.id = group._id;

        return group;
    }

    handleSave(e) {
        e.preventDefault();

        this.hasChanges = false;
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

        if (this.props.isCreator) {//remove
            swal({
                titleText: 'Are you sure you want to delete this user group?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((accepted) => {
                this.context.executeAction(deleteUsergroup, {groupid: this.props.currentUsergroup.id});
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
                this.context.executeAction(leaveUsergroup, {groupid: this.props.currentUsergroup.id});
            }, (cancelled) => {/*do nothing*/})
                .catch(swal.noop);
        }
    }

    handleClickRemoveMember(member) {
        // console.log('handleClickRemoveMember', member, 'from', this.props.currentUsergroup.members);

        let group = this.getGroup(this.props.currentUsergroup.members);
        this.hasChanges = true;

        group.members = group.members.filter((gmember) => {
            return gmember.userid !== member.userid;
        });

        this.context.executeAction(updateUsergroup, {group: group, offline: true});
    }

    handleClickAdmin(member, shouldBeAdmin = false) {
        console.log('handleClickAdmin', member, shouldBeAdmin);

        let group = this.getGroup(this.props.currentUsergroup.members);
        this.hasChanges = true;

        group.members.forEach((gmember) => {
            if (gmember.userid === member.userid) {
                gmember.role = shouldBeAdmin ? 'admin' : '';
            }
        });

        this.context.executeAction(updateUsergroup, {group: group, offline: true});
    }

    render() {
        // console.log('Details render', this.props.currentUsergroup);
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
                let handler2 = () => {
                    this.handleClickAdmin(member, false);
                };
                let handler3 = () => {
                    this.handleClickAdmin(member, true);
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
                        <div className={((this.props.isAdmin || this.props.isCreator) && member.userid !== this.props.userid ? 'thirteen' : 'fourteen') + ' wide column'}>
                          <div className="content">
                              <TextArea className="sr-only" id={'usernameIsALinkHint' + member.userid} value={this.context.intl.formatMessage(this.messages.messageUsericon)} tabIndex ='-1'/>
                              <a className="header" href={'/user/' + member.username} target="_blank">{member.displayName || member.username}</a>{(member.role === 'admin') ? <b>Admin</b> : ''}
                              <div className="description">{optionalElement}{optionalText}</div>
                          </div>
                        </div>
                        {
                          (this.props.isAdmin || this.props.isCreator) && member.userid !== this.props.userid ?
                            (member.role === 'admin') ?
                              <div className="one wide column middle aligned">
                                <button className="ui basic icon button" data-tooltip="Remove admin role" aria-label="remove admin role" onClick={handler2}>
                                  <i className="user times middle aligned icon"></i>
                                </button>
                              </div>
                            :
                              <div className="one wide column middle aligned">
                                <button className="ui basic icon button" data-tooltip="Add admin role" aria-label="add admin role" onClick={handler3}>
                                  <i className="user plus middle aligned icon"></i>
                                </button>
                              </div>
                            : ''
                        }
                        {(this.props.isAdmin || this.props.isCreator) && member.userid !== this.props.userid ?
                          <div className="one wide column middle aligned">
                            <button className="ui basic icon button" data-tooltip="Remove group member" aria-label="remove group member" onClick={fct}>
                              <i className="remove middle aligned icon"></i>
                            </button>
                          </div>
                        : ''}
                      </div>
                    </div>
                  )
                );
            });
        }

        let buttons = '';
        if (this.props.isMember && !this.props.isAdmin) {
            buttons = <div className="ui buttons"><button className="ui labeled icon button" onClick={this.handleExitGroup.bind(this)} >
                <i className="remove icon"></i>{this.context.intl.formatMessage(this.messages.leaveGroup)}
            </button></div>;
        }
        else if (this.props.isAdmin) {
            buttons = <div className="ui grid">
              <div className="nine wide column"></div>
              <div className="seven wide column">
                <div className="ui buttons">
                  <button className="ui blue labeled submit icon button" onClick={this.handleSave.bind(this)} >
                      <i className="save icon"></i>{this.context.intl.formatMessage(this.messages.saveGroup)}
                  </button>
                  &nbsp;
                  <button className="ui right labeled icon button" name="" onClick={this.handleExitGroup.bind(this)} >
                      <i className="remove icon"></i>{this.context.intl.formatMessage(this.messages.leaveGroup)}
                  </button>
                </div>
              </div>
            </div>;
        }
        else if (this.props.userid && this.props.isCreator) {
            buttons = <div className="ui grid">
              <div className="nine wide column"></div>
              <div className="seven wide column">
                <div className="ui buttons">
                  <button className="ui blue labeled submit icon button" onClick={this.handleSave.bind(this)} >
                      <i className="save icon"></i>{this.context.intl.formatMessage(this.messages.saveGroup)}
                  </button>
                  &nbsp;
                  <button className="ui right labeled icon button" onClick={this.handleExitGroup.bind(this)} >
                      <i className="remove icon"></i>{this.context.intl.formatMessage(this.messages.deleteGroup)}
                  </button>
                </div>
              </div>
            </div>;
        }

        return (
          <div>
            <div className="ui segments">
              <div className="ui secondary clearing segment">
                  <h1 className="ui left floated header" id="main">{(this.props.isAdmin || this.props.isCreator) ? this.context.intl.formatMessage(this.messages.details) : this.context.intl.formatMessage(this.messages.members)}</h1>
              </div>
              <div className="ui segment">
                <div className="ui container">
                    <div className="ui two column vertically padded grid container">
                        <div className="ui container">
                          {(this.props.isAdmin || this.props.isCreator || this.props.isMember) ?
                              <div>
                                {(this.props.isAdmin || this.props.isCreator) ?
                                <div>
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
                                </div>
                                : ''}
                                  {buttons}
                                {(this.props.saveUsergroupIsLoading === true) ? <div className="ui active dimmer"><div className="ui text loader">{this.context.intl.formatMessage(this.messages.loading)}</div></div> : ''}

                                <div className="ui hidden divider">
                                </div>

                                <div className="ui header">
                                    <h2>{this.context.intl.formatMessage(this.messages.members)}</h2>
                                </div>
                              </div>
                            : '' }

                            <div className="ui relaxed divided list">
                                {userlist}
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            {(this.props.isAdmin || this.props.isCreator) ?
              <div className="ui segments">
                <div className="ui secondary segment">
                    <h2>
                      <FormattedMessage
                        id='GroupDetails.exchangePicture'
                        defaultMessage='Group picture'
                      />
                    </h2>
                </div>
                <div className="ui segment">
                    <ChangePicture group={ this.props.currentUsergroup }/>
                </div>
              </div>
            : '' }
          </div>
        );
    }
}

Details.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default Details;
