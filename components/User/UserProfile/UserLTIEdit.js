import PropTypes from 'prop-types';
import React from 'react';
import { Microservices } from '../../../configs/microservices';
import {NavLink, navigateAction} from 'fluxible-router';
import { TextArea } from 'semantic-ui-react';
import { timeSince } from '../../../common';
import UserPicture from '../../common/UserPicture';
import updateUserlti from '../../../actions/user/userprofile/updateUserlti';
import saveUserlti from '../../../actions/user/userprofile/saveUserlti';
import cancelUserlti from '../../../actions/user/userprofile/cancelUserlti';

class UserLTIEdit extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
    }

    componentDidUpdate() {
        // console.log('UserLTIEdit componentDidUpdate:', this.props.saveUserLTIError, this.props.currentUserlti);
        if (this.props.saveUserltiError) {
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
        this.refs.LTIKey.value = this.props.currentUserlti.key || '';
        this.refs.LTISecret.value = this.props.currentUserlti.secret || '';
    }

    componentDidMount() {
        $('#userlti_edit_dropdown_usernames_remote')
            .dropdown({
                apiSettings: {
                    url: Microservices.user.uri + '/information/username/search/{query}',
                    cache: false
                },
                saveRemoteData: false,
                action: (name, value, source) => {
                    // console.log('dropdown select', name, value, source);

                    $('#userlti_edit_dropdown_usernames_remote').dropdown('clear');
                    $('#userlti_edit_dropdown_usernames_remote').dropdown('hide');

                    let lti = this.getLTI(this.props.currentUserlti.members);
                    if (lti.members === undefined || lti.members === null)
                        lti.members = [];

                    let data = JSON.parse(decodeURIComponent(value));
                    console.log('trying to add', name, 'to', lti.members, ' with ', data);
                    if (lti.members.findIndex((member) => {
                        return member.userid === parseInt(data.userid);
                    }) === -1 && data.username !== this.props.username) {
                        lti.members.push({
                            username: data.username,
                            userid: parseInt(data.userid),
                            joined: data.joined || undefined,
                            picture: data.picture,
                            country: data.country,
                            organization: data.organization
                        });
                    }

                    this.context.executeAction(updateUserlti, {lti: lti, offline: true});

                    return true;
                }
            });
    }

    getLTI(members = undefined) {

        let lti = {
            _id: this.props.currentUserlti._id,
            key: this.refs.LTIKey.value,
            secret: this.refs.LTISecret.value,
            members: members,
            timestamp: this.props.currentUserlti.timestamp || '',
            creator: this.props.currentUserlti.creator || this.props.userid
        };

        if (this.props.currentUserlti._id)
            lti.id = lti._id;

        //TODO get members from list

        return lti;
    }

    handleClickOnEditLTI(e) {
        e.preventDefault();
    }

    handleSave(e) {
        e.preventDefault();

        let lti = this.getLTI(this.props.currentUserlti.members);

        console.log('handleSave:', lti);

        if (lti.key === '') {
            swal({
                title: 'Error',
                text: 'At least you have to specify the LTI Key.',
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

        this.context.executeAction(saveUserlti, lti);
    }

    handleCancel(e) {
        e.preventDefault();
        console.log('handleCancel:');
        this.context.executeAction(cancelUserlti);
    }

    handleClickRemoveMember(member) {
        // console.log('handleClickRemoveMember', member, 'from', this.props.currentUserlti.members);
        let lti = this.getLTI(this.props.currentUserlti.members);

        lti.members = lti.members.filter((gmember) => {
            return gmember.userid !== member.userid;
        });

        this.context.executeAction(updateUserlti, {lti: lti, offline: true});
    }

    render() {
        //console.log('UserLTIEdit rendered');
        const signUpLabelStyle = {width: '150px'};

        let userlist = [];
        //change header and data depending on lti should be created or edited
        let header = 'Add Learning Service';
        if (this.props.currentUserlti._id !== undefined) {
            header = 'Edit Learning Service';
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
                    <TextArea className="sr-only" id={'usernameIsALinkHint' + this.props.userid} value="The username is a link which will open a new browser tab. Close it when you want to go back to the form and list." tabIndex ='-1'/>
                    <a className="header" href={'/user/' + this.props.username} target="_blank">{this.props.username}</a>
                    <div className="description">LTI owner</div>
                </div>
              </div>
            </div>
          </div>
        );

        // console.log('render UserLTIEdit:', this.props.currentUserlti.members);
        if (this.props.currentUserlti.members !== undefined && this.props.currentUserlti.members.length > 0) {
            this.props.currentUserlti.members.forEach((member) => {
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
                              <TextArea className="sr-only" id={'usernameIsALinkHint' + member.userid} value="The username is a link which will open a new browser tab. Close it when you want to go back to the form and list." tabIndex ='-1'/>
                              <a className="header" href={'/user/' + member.username} target="_blank">{member.username}</a>
                              <div className="description">{optionalElement}{optionalText}</div>
                          </div>
                        </div>
                        <div className="one wide column middle aligned">
                          <button className="ui basic icon button" data-tooltip="Remove lti member" aria-label="remove lti member">
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
                        <div className="field" data-tooltip="lti key" >
                            <label htmlFor="userltiedit_input_LTIKey">
                                LTI Key
                            </label>
                            <input type="text" placeholder="Key" id="userltiedit_input_LTIKey" name="LTIKey" ref="LTIKey" aria-labelledby="LTIKey" aria-required="true" defaultValue={this.props.currentUserlti.key || ''}  />
                        </div>

                        <div className="field">
                            <label htmlFor="userltiedit_input_LTISecret">Secret</label>
                            <input type="text" aria-labelledby="LTISecret" id="userltiedit_input_LTISecret" name="LTISecret" ref="LTISecret" defaultValue={this.props.currentUserlti.secret || ''} />
                        </div>

                        </form>
                        <div className="ui hidden divider">
                        </div>

                        <div>
                          {(this.props.currentUserlti._id === undefined) ?
                            <button className="ui button" onClick={this.handleCancel.bind(this)} >Cancel </button> : ''}
                            <button className="ui blue labeled submit icon button" onClick={this.handleSave.bind(this)} >
                                Save
                            </button>
                        </div>


                        {(this.props.saveUserltiIsLoading === true) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}

                        <div className="ui hidden divider">
                        </div>


                    </div>
                </div>
            </div>
        );
    }
}

UserLTIEdit.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default UserLTIEdit;
