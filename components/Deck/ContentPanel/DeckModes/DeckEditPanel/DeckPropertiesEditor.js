import React from 'react';
import { Microservices } from '../../../../../configs/microservices';
import classNames from 'classnames';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import ContentUtil from '../../util/ContentUtil';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import saveDeckEdit from '../../../../../actions/saveDeckEdit';
import saveDeckRevision from '../../../../../actions/saveDeckRevision';
import updateAuthorizedUsers from '../../../../../actions/updateAuthorizedUsers';
import { timeSince } from '../../../../../common';


class DeckPropertiesEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getStateFromProps(props);
    }

    getStateFromProps(props) {
        return {
            validationErrors: {},
            title: props.deckProps.title || '',
            language: props.deckProps.language || '',
            description: props.deckProps.description || '',
            theme: props.deckProps.theme || '',
            license: props.deckProps.license || '',
            accessLevel: props.deckProps.accessLevel || 'public',
            users: '',//TODO read users and groups from deck props
            groups: ''
        };
    }

    componentWillReceiveProps(newProps) {
        //check if props have changed to reinitialize state (for handling route changes)
        if (newProps.deckProps !== this.props.deckProps) {
            this.setState(this.getStateFromProps(newProps));
        }
    }

    componentDidMount() {
        $('#deck_edit_dropdown_groups')
            .dropdown()
        ;

        $('#deck_edit_dropdown_usernames_remote')
            .dropdown({
                apiSettings: {
                    url: Microservices.user.uri + '/information/username/search/{query}'
                },
                saveRemoteData: false,
                action: (name, value, source) => {
                    console.log('dropdown select', name, value, source);

                    $('#deck_edit_dropdown_usernames_remote').dropdown('clear');
                    $('#deck_edit_dropdown_usernames_remote').dropdown('hide');

                    let users = this.props.DeckEditStore.authorizedUsers;
                    if (users === undefined || users === null)
                        users = [];

                    // console.log('trying to add', name, 'to', group.members);
                    if (users.findIndex((member) => {
                        return member.username === name && member.userid === parseInt(value);
                    }) === -1 && name !== this.props.UserProfileStore.username) {
                        users.push({
                            username: name,
                            userid: parseInt(value),
                            joined: (new Date()).toISOString()
                        });
                    }

                    this.context.executeAction(updateAuthorizedUsers, users);

                    return true;
                }
            });
    }

    handleCancel() {
        this.context.executeAction(navigateAction, {
            url: ContentUtil.makeNodeURL(this.props.selector, 'view')
        });
    }

    handleSave(withNewRevision) {
        const saveAction = withNewRevision ? saveDeckRevision : saveDeckEdit;
        let validationErrors = {}, isValid = true;

        if (this.state.title == null || this.state.title.length === 0) {
            validationErrors.title = 'Please enter a title.';
            isValid = false;
        }

        if (this.state.language == null || this.state.language.length !== 5) {
            validationErrors.language = 'Please select a language.';
            isValid = false;
        }

        if (this.state.license == null || this.state.license.length < 2) {
            validationErrors.license = 'Please select a license.';
            isValid = false;
        }

        let users = [], groupids = [];
        if (this.state.accessLevel === 'restricted') {
            users = this.props.DeckEditStore.authorizedUsers;
            groupids = $('#deck_edit_dropdown_groups').dropdown('get value').split(',');

            if (users.length === 0 && (groupids.length === 0  || (groupids.length === 1 && groupids[0] === ''))) {
                validationErrors.accessLevel = 'The access level needs at minimum one selected group or user.';
                isValid = false;
            }
        }
        console.log('handleSave', this.state.accessLevel, users, groupids);

        this.setState({validationErrors: validationErrors});
        //TODO does a reload after button is pressed
        if (isValid) {
            swal({
                title: 'Saving Deck Properties...',
                text: '',
                type: 'success',
                timer: 1000,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });
            this.context.executeAction(saveAction, {
                deckId: this.props.selector.sid != null ? this.props.selector.sid : this.props.selector.id,
                title: this.state.title,
                language: this.state.language,
                description: this.state.description,
                theme: this.state.theme,
                license: this.state.license,
                tags: [],
                selector: this.props.selector,
                accessLevel: this.state.accessLevel,
                users: users,
                groups: groupids
            });
        }
    }

    handleChange(fieldName, event) {
        var stateChange = {};
        stateChange[fieldName] = event.target.value;
        this.setState(stateChange);
    }

    handleClickRemoveUser(member) {
        console.log('handleClickRemoveUser', member, this.props.DeckEditStore.authorizedUsers);

        let users = this.props.DeckEditStore.authorizedUsers;

        let newMembers = users.filter((member2) => {
            return !(member2.username === member.username && member2.userid === parseInt(member.userid));
        });

        this.context.executeAction(updateAuthorizedUsers, newMembers);
    }

    render() {
        let userid = this.props.UserProfileStore.userid;
        let isUserEditor = false;
        if (userid != null && userid !== '' && this.props.DeckEditStore.editors.includes(userid)) {
            isUserEditor = true;
        }

        let titleFieldClass = classNames({
            'required': true,
            'field': true,
            'error': this.state.validationErrors.title != null
        });
        let langFieldClass = classNames({
            'required': true,
            'field': true,
            'error': this.state.validationErrors.language != null
        });
        let licenseFieldClass = classNames({
            'required': true,
            'field': true,
            'error': this.state.validationErrors.license != null
        });
        let accessLevelFieldClass = classNames({
            'required': true,
            'field': true,
            'error': this.state.validationErrors.accessLevel != null
        });
        let languageOptions = <select className="ui search dropdown" id="language" aria-labelledby="language"
                                      aria-required="true"
                                      value={this.state.language}
                                      onChange={this.handleChange.bind(this, 'language')}>
            <option>
                Select Language
            </option>
            <option value="en_GB" >
                English
            </option>
            <option value="de_DE" >
                German
            </option>
            <option value="el_GR" >
                Greek
            </option>
            <option value="it_IT" >
                Italian
            </option>
            <option value="pt_PT" >
                Portugese
            </option>
            <option value="sr_RS" >
                Serbian
            </option>
            <option value="es_ES" >
                Spanish
            </option>
        </select>;
        let themeOptions = <select className="ui search dropdown" id="themes" aria-labelledby="theme"
                                   selected={this.state.theme}
                                   onChange={this.handleChange.bind(this, 'theme')}>
            <option value="DefaultTheme">Default</option>
        </select>;
        let licenseOptions = <select className="ui search dropdown" id="license" aria-labelledby="license"
                                     value={this.state.license}
                                     onChange={this.handleChange.bind(this, 'license')}>
            <option value="CC0">CC0</option>
            <option value="CC BY">CC BY</option>
            <option value="CC BY-SA">CC BY-SA</option>
        </select>;

        let visibilityOptions = <select className="ui search dropdown" id="accessLevel" aria-labelledby="accessLevel"
                                     value={this.state.accessLevel}
                                     onChange={this.handleChange.bind(this, 'accessLevel')}>
            <option value="public">public</option>
            <option value="restricted">restricted</option>
            <option value="private">private</option>
        </select>;

        let groupsArray = [];
        if (this.props.UserProfileStore.user.groups)
            this.props.UserProfileStore.user.groups.forEach((group) => {
                groupsArray.push((
                    <div key={group._id} className="item" data-value={group._id}>{group.name} ({group.members.length} member{(group.members.length !== 1) ? 's': ''})</div>
                ));
            });
        let groupsOptions = <div className="ui fluid multiple search selection dropdown" id="deck_edit_dropdown_groups" aria-labelledby="groups"
                                     onChange={this.handleChange.bind(this, 'groups')}>
                                     <input type="hidden" name="groups" />
            <i className="dropdown icon"></i>
            <div className="default text">Select Groups</div>
            <div className="menu">
              {groupsArray}
            </div>
        </div>;

        let groupsFieldClass = classNames({
            'field': true,
            'disabled': this.state.accessLevel !== 'restricted'
        });

        let userlist = [];
        if (this.props.DeckEditStore.authorizedUsers !== undefined && this.props.DeckEditStore.authorizedUsers.length > 0) {
            this.props.DeckEditStore.authorizedUsers.forEach((user) => {
                let fct = () => {
                    this.handleClickRemoveUser(user);
                };
                userlist.push(
                  (
                    <div className="item" key={user.userid}>
                      <div className="ui grid">
                        <div className="one wide column middle aligned">
                          <i className="large user middle aligned icon"></i>
                        </div>
                        <div className="fourteen wide column">
                          <div className="content">
                              <a className="header" href={'/user/' + user.username}>{user.username}</a>
                              <div className="description">Access granted {timeSince((new Date(user.joined)))} ago</div>
                          </div>
                        </div>
                        <div className="one wide column middle aligned">
                          <i className="remove middle aligned icon" key={user.userid} onClick={fct}></i>
                        </div>
                      </div>
                    </div>
                  )
                );
            });
        }

        let saveDeckButton = isUserEditor ?
        <button className='ui primary button'
             onClick={this.handleSave.bind(this, false)}>Save</button> : '';

        return (
        <div className="ui container">
            <div className="ui grid">
                <div className="sixteen wide column">
                    <form className="ui form">
                        <div className="two fields">
                            <div className={titleFieldClass} data-tooltip={this.state.validationErrors.title}>
                                <label>
                                    Title
                                </label>
                                <input type="text" name="deck-title" value={this.state.title}
                                       onChange={this.handleChange.bind(this, 'title')} placeholder="Title"
                                       aria-required="true"/>

                            </div>
                            <div className={langFieldClass} data-tooltip={this.state.validationErrors.language}>
                                <label id="language">
                                    Language
                                </label>
                                {languageOptions}
                            </div>
                        </div>
                        <div className="field">
                            <label id="deck-description">Description</label>
                            <textarea rows="4" aria-labelledby="deck-description"
                                      value={this.state.description}
                                      onChange={this.handleChange.bind(this, 'description')}/>
                        </div>
                        <div className="two fields">
                            <div className="field disabled">
                                <label id="themes">Choose deck theme</label>
                                {themeOptions}
                            </div>
                            <div className={licenseFieldClass} data-tooltip={this.state.validationErrors.license}>
                                <label id="license">License</label>
                                {licenseOptions}
                            </div>
                        </div>
                        <div className={accessLevelFieldClass} data-tooltip={this.state.validationErrors.accessLevel}>
                            <label id="accessLevel">Choose general access level</label>
                            {visibilityOptions}
                        </div>
                        <div className="two fields">
                            <div className={groupsFieldClass}>
                                <label id="groups">Add groups for edit rights</label>
                                {groupsOptions}
                            </div>
                            <div className={groupsFieldClass}>
                                <label htmlFor="deck_edit_dropdown_usernames_remote">Add users for edit rights</label>
                                <select className="ui search dropdown" aria-labelledby="AddUser" name="AddUser" ref="AddUser" id="deck_edit_dropdown_usernames_remote">
                                </select>
                            </div>
                        </div>

                        {this.state.accessLevel === 'restricted' ? (
                          <div className="field">
                              <div className="ui tiny header">
                                  Authorized users:
                              </div>
                              <div className="ui relaxed divided list">
                                  {userlist}
                              </div>
                              <div className="ui hidden divider">
                              </div>
                          </div>
                        ) : ''}

                        {saveDeckButton}
                        <button className='ui primary button'
                             onClick={this.handleSave.bind(this, true)}>
                            Save as new revision
                        </button>
                        <button className="ui secondary button"
                             onClick={this.handleCancel.bind(this)}>
                            Cancel
                        </button>
                    </form>
                </div>

            </div>
        </div>
        );

    }
}

DeckPropertiesEditor.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

DeckPropertiesEditor = connectToStores(DeckPropertiesEditor, [DeckEditStore, UserProfileStore], (context, props) => {
    return {
        DeckEditStore: context.getStore(DeckEditStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default DeckPropertiesEditor;
