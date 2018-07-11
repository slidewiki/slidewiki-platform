import PropTypes from 'prop-types';
import React from 'react';
import { Microservices } from '../../../configs/microservices';
import {NavLink, navigateAction} from 'fluxible-router';
import { TextArea } from 'semantic-ui-react';
import { timeSince } from '../../../common';
import UserPicture from '../../common/UserPicture';
import updateUsergroup from '../../../actions/user/userprofile/updateUsergroup';
import saveUsergroup from '../../../actions/user/userprofile/saveUsergroup';
import { FormattedMessage, defineMessages } from 'react-intl';

class UserGroupEdit extends React.Component {
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
        this.refs.GroupName.value = this.props.currentUsergroup.name || '';
        this.refs.GroupDescription.value = this.props.currentUsergroup.description || '';
    }

    componentDidMount() {
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
                            organization: data.organization
                        });
                    }

                    this.context.executeAction(updateUsergroup, {group: group, offline: true});

                    return true;
                }
            });
    }

    getGroup(members = undefined) {
        let group = {
            _id: this.props.currentUsergroup._id,
            name: this.refs.GroupName.value,
            description: this.refs.GroupDescription.value,
            members: members,
            timestamp: this.props.currentUsergroup.timestamp || '',
            creator: this.props.currentUsergroup.creator || this.props.userid
        };

        if (this.props.currentUsergroup._id)
            group.id = group._id;

        //TODO get members from list

        return group;
    }

    handleClickOnEditGroup(e) {
        e.preventDefault();
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

    handleClickRemoveMember(member) {
        // console.log('handleClickRemoveMember', member, 'from', this.props.currentUsergroup.members);

        let group = this.getGroup(this.props.currentUsergroup.members);

        group.members = group.members.filter((gmember) => {
            return gmember.userid !== member.userid;
        });

        this.context.executeAction(updateUsergroup, {group: group, offline: true});
    }

    render() {
        const signUpLabelStyle = {width: '150px'};

        let userlist = [];
        //change header and data depending on group should be created or edited
        let header = this.context.intl.formatMessage(this.messages.createGroup);
        if (this.props.currentUsergroup._id !== undefined) {
            header = this.context.intl.formatMessage(this.messages.editGroup);
        }

        //add creator as default member
        userlist.push(
          <div className="item" key={this.props.userid}>
            <div className="ui grid">
              <div className="one wide column middle aligned">
                <UserPicture picture={ this.props.picture } username={ this.props.username } avatar={ true } width= { 24 } />
              </div>
              <div className="fourteen wide column">
                <div className="content">
                    <TextArea className="sr-only" id={'usernameIsALinkHint' + this.props.userid} value={this.context.intl.formatMessage(this.messages.messageUsericon)} tabIndex ='-1'/>
                    <a className="header" href={'/user/' + this.props.username} target="_blank">{this.props.username}</a>
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
                              <a className="header" href={'/user/' + member.username} target="_blank">{member.username}</a>
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
                    <div className="column">
                        <h3>{header}</h3>
                    </div>
                    <div className="right aligned column">

                    </div>
                    <div className="ui hidden divider"></div>
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

UserGroupEdit.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

export default UserGroupEdit;
