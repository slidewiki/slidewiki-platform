import React from 'react';
import { Microservices } from '../../../configs/microservices';
import { connectToStores } from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import { timeSince } from '../../../common';
import UserPicture from '../../common/UserPicture';
import updateUsergroup from '../../../actions/user/userprofile/updateUsergroup';
import saveUsergroup from '../../../actions/user/userprofile/saveUsergroup';

class UserGroupEdit extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
    }

    componentDidUpdate() {
        console.log('UserGroupEdit componentDidUpdate:', this.props.saveUsergroupError);
        if (this.props.saveUsergroupError) {
            swal({
                title: 'Error',
                text: 'Unknown error while saving.',
                type: 'error',
                confirmButtonText: 'Close',
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
                    console.log('trying to add', name, 'to', group.members, ' with ', data);
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

        console.log('handleSave:', group);

        if (group.name === '') {
            swal({
                title: 'Error',
                text: 'At least you have to give the group a name.',
                type: 'error',
                confirmButtonText: 'Close',
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
        let prefs = {
            name: this.props.currentUsergroup.name,
            desc: this.props.currentUsergroup.description
        };
        //change header and data depending on group should be created or edited
        let header = 'Create Group';
        if (this.props.currentUsergroup._id !== undefined) {
            header = 'Edit Group';
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
                    <a className="header" href={'/user/' + this.props.username}>{this.props.username}</a>
                    <div className="description">Group owner</div>
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
                    {member.organization || 'Unknown organization'} ({member.country || 'unknown country'})
                    <br/>
                  </div>
                ) : '';
                let optionalText = (member.joined) ? ('Joined '+timeSince((new Date(member.joined)))+' ago') : '';
                userlist.push(
                  (
                    <div className="item" key={member.userid}>
                      <div className="ui grid">
                        <div className="one wide column middle aligned">
                          <UserPicture picture={ member.picture } username={ member.username } avatar={ true } width= { 24 } />
                        </div>
                        <div className="fourteen wide column">
                          <div className="content">
                              <a className="header" href={'/user/' + member.username}>{member.username}</a>
                              <div className="description">{optionalElement}{optionalText}</div>
                          </div>
                        </div>
                        <div className="one wide column middle aligned">
                          <i className="remove middle aligned icon" key={member.userid} onClick={fct}></i>
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
                            <div className="field" data-tooltip="group name" >
                                <label htmlFor="usergroupedit_input_GroupName">
                                    Group Name
                                </label>
                                <input type="text" placeholder="Name" id="usergroupedit_input_GroupName" name="GroupName" ref="GroupName" aria-labelledby="GroupName" aria-required="true" defaultValue={prefs.name}  />
                            </div>

                            <div className="field">
                                <label htmlFor="usergroupedit_input_GroupDescription">Description</label>
                                <textarea rows="4" aria-labelledby="GroupDescription" id="usergroupedit_input_GroupDescription" name="GroupDescription" ref="GroupDescription" defaultValue={prefs.desc} ></textarea>
                            </div>
                            <div className="field">
                                <label htmlFor="usergroupedit_input_AddUserGr">Add user</label>
                                <select className="ui search dropdown" aria-labelledby="AddUserGr" id="usergroupedit_input_AddUserGr" name="AddUserGr" ref="AddUserGr" id="usergoup_edit_dropdown_usernames_remote">
                                </select>
                            </div>
                        </form>
                        <div className="ui hidden divider">
                        </div>
                        <div className="ui buttons">
                            <button className="ui blue labeled submit icon button" onClick={this.handleSave.bind(this)} >
                                <i className="save icon"></i>Save group
                            </button>
                        </div>
                        {(this.props.saveUsergroupIsLoading === true) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}

                        <div className="ui hidden divider">
                        </div>

                        <div className="ui header">
                            <h3>Members</h3>
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
    executeAction: React.PropTypes.func.isRequired
};

export default UserGroupEdit;
