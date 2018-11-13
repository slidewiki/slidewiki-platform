import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Microservices } from '../../../../../configs/microservices';
import classNames from 'classnames';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import { TextArea, Dropdown, Checkbox } from 'semantic-ui-react';
import {FormattedMessage, defineMessages} from 'react-intl';

import Util from '../../../../common/Util';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import saveDeckEdit from '../../../../../actions/saveDeckEdit';
import {updateAuthorizedUsers, updateAuthorizedGroups} from '../../../../../actions/updateDeckAuthorizations';
import updateDeckEditViewState from '../../../../../actions/updateDeckEditViewState';
import GroupDetailsModal from './GroupDetailsModal';
import { timeSince } from '../../../../../common';
import UserPicture from '../../../../common/UserPicture';
import loadUsergroup from '../../../../../actions/deckedit/loadUsergroup';
import TagsStore from '../../../../../stores/TagsStore';
import PermissionsStore from '../../../../../stores/PermissionsStore';
import updateTheme from '../../../../../actions/updateTheme';
import {showGroupDetailsModal} from '../../../../../actions/deckedit/functionsForGroupDetailsModal';
import deckDeletion from '../../../../../actions/deckedit/deckDeletion';
import TransferOwnership from './TransferOwnership';
import loadEditors from '../../../../../actions/deckedit/loadEditors';

import {educationLevels} from '../../../../../lib/isced';
import TagInput from '../../../ContentModulesPanel/TagsPanel/TagInput';

class DeckPropertiesEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getStateFromProps(props);
    }

    getStateFromProps(props) {
        let editors = props.deckProps.editors || {
            users: [],
            groups: [],
        };

        return {
            validationErrors: {},
            title: props.deckProps.title || '',
            allowMarkdown: props.deckProps.allowMarkdown || false,
            description: props.deckProps.description || '',
            theme: props.deckProps.theme || '',
            //license: props.deckProps.license || '',
            license: 'CC BY-SA',
            users: editors.users || [],
            groups: editors.groups || [],
            published: !props.deckProps.hidden,
            educationLevel: props.deckProps.educationLevel,
            tags: props.deckProps.tags || [],
            topics: props.deckProps.topics || [],
        };
    }

    componentWillReceiveProps(newProps) {
        // console.log('DeckPropertiesEditor componentWillReceiveProps');
        //check if props have changed to reinitialize state (for handling route changes)
        if (newProps.deckProps !== this.props.deckProps) {
            this.setState(this.getStateFromProps(newProps));
        }
        if (this.props.DeckEditStore.viewstate === 'loading') {
            if (newProps.DeckEditStore.viewstate === 'error') {
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
            }
            else if (newProps.DeckEditStore.viewstate === 'success') {
                swal({
                    title: 'Success',
                    text: 'The deck was saved.',
                    type: 'success',
                    confirmButtonText: 'Confirm',
                    confirmButtonClass: 'positive ui button',
                    allowEscapeKey: true,
                    allowOutsideClick: true,
                    buttonsStyling: false,
                    onOpen: () => {
                        $('.swal2-confirm').focus();
                    }
                })
                    .then(() => {
                        return true;
                    })
                    .catch();
            }
            else if (newProps.DeckEditStore.viewstate === 'errorDelete') {
                swal({
                    title: 'Error',
                    text: 'Unknown error while deleting.',
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
            }
            else if (newProps.DeckEditStore.viewstate === 'successDelete') {
                swal({
                    title: 'Success',
                    text: 'The deck was deleted.',
                    type: 'success',
                    confirmButtonText: 'Confirm',
                    confirmButtonClass: 'positive ui button',
                    allowEscapeKey: true,
                    allowOutsideClick: false,
                    buttonsStyling: false
                })
                    .then(() => {
                        this.context.executeAction(navigateAction, {
                            url: '/user/' + this.context.getUser().username
                        });
                    })
                    .catch(() => {
                        this.context.executeAction(navigateAction, {
                            url: '/'
                        });
                    });
            }
            else if (newProps.DeckEditStore.viewstate === 'errorEditors') {
                swal({
                    title: 'Error',
                    text: 'Unknown error while loading editors.',
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
            }
            else if (newProps.DeckEditStore.viewstate === 'errorTransfer') {
                swal({
                    title: 'Error',
                    text: 'Unknown error while transfering ownership.',
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
            }
            else if (newProps.DeckEditStore.viewstate === 'successTransfer') {
                swal({
                    title: 'Success',
                    text: 'The ownership was transfered.',
                    type: 'success',
                    confirmButtonText: 'Confirm',
                    confirmButtonClass: 'positive ui button',
                    allowEscapeKey: true,
                    allowOutsideClick: false,
                    buttonsStyling: false
                })
                    .then(() => {
                        this.context.executeAction(navigateAction, {
                            url: '/user/' + this.context.getUser().username
                        });
                    })
                    .catch(() => {
                        this.context.executeAction(navigateAction, {
                            url: '/'
                        });
                    });
            }
        }
    }
    componentDidUpdate() {
        // console.log('DeckPropertiesEditor componentDidUpdate', this.props.DeckEditStore.showGroupModal);
        this.handleDropboxes();
    }

    componentDidMount() {
        this.handleDropboxes();
    }

    handleDropboxes() {
        $(ReactDOM.findDOMNode(this.refs.AddGroups))
            .dropdown({
                action: (someText, dataValue, source) => {
                // console.log('group dropdown select', dataValue);

                    $(ReactDOM.findDOMNode(this.refs.AddGroups)).dropdown('clear');
                    $(ReactDOM.findDOMNode(this.refs.AddGroups)).dropdown('hide');

                    let groups = this.props.DeckEditStore.authorizedGroups;
                    if (groups === undefined || groups === null)
                        groups = [];

                    let data = JSON.parse(decodeURIComponent(dataValue));
                    if (groups.findIndex((group) => {
                        return group.id === parseInt(data.id);
                    }) === -1) {
                        groups.push({
                            name: data.name,
                            id: parseInt(data.id),
                            joined: (new Date()).toISOString()
                        });
                    }

                    this.context.executeAction(updateAuthorizedGroups, groups);

                    return true;
                }
            });

        $(ReactDOM.findDOMNode(this.refs.AddUser))
            .dropdown({
                apiSettings: {
                    url: Microservices.user.uri + '/information/username/search/{query}',
                    cache: false
                },
                saveRemoteData: false,
                action: (name, value, source) => {
                    let data = JSON.parse(decodeURIComponent(value));
                // console.log('user dropdown select', name, value, data);

                    $(ReactDOM.findDOMNode(this.refs.AddUser)).dropdown('clear');
                    $(ReactDOM.findDOMNode(this.refs.AddUser)).dropdown('hide');

                    let users = this.props.DeckEditStore.authorizedUsers;
                    if (users === undefined || users === null)
                        users = [];

                // console.log('trying to add', name, 'to', users);
                    if (users.findIndex((member) => {
                        return member.id === parseInt(data.userid);
                    }) === -1 && parseInt(data.userid) !== this.props.userid) {
                        users.push({
                            username: data.username,
                            id: parseInt(data.userid),
                            joined: data.joined || (new Date()).toISOString(),
                            picture: data.picture,
                            country: data.country,
                            organization: data.organization,
                            displayName: data.displayName
                        });
                    }

                    this.context.executeAction(updateAuthorizedUsers, users);

                    return true;
                }
            });
    }

    handleCancel(event) {
        event.preventDefault();

        this.context.executeAction(navigateAction, {
            url: Util.makeNodeURL(this.props.selector, this.props.selector.page, 'view')
        });
    }

    handleSave(event) {
        event.preventDefault();
        let validationErrors = {}, isValid = true;

        if (this.state.title == null || this.state.title.length === 0) {
            validationErrors.title = 'Please enter a title.';
            isValid = false;
        }

        /*
        if (this.state.license == null || this.state.license.length < 2) {
            validationErrors.license = 'Please select a license.';
            isValid = false;
        }
        */

        let users = [], groups = [];
        users = this.props.DeckEditStore.authorizedUsers;
        groups = this.props.DeckEditStore.authorizedGroups;
        // console.log('handleSave', users, groups, isValid);

        // for topics we need to merge with tags in state
        let newTags = [...this.state.tags, ...this.topicInput.getSelected()];
        // as topics are never new, and we don't change the other tags, tagName is all we need
        newTags = newTags.map((t) => ({ tagName: t.tagName }));

        this.setState({validationErrors: validationErrors});
        if (isValid) {
            let deckId = this.props.selector.sid != null ? this.props.selector.sid : this.props.selector.id;

            this.context.executeAction(updateDeckEditViewState, 'loading');
            this.context.executeAction(saveDeckEdit, {
                deckId: deckId,
                title: this.state.title,
                allowMarkdown: this.state.allowMarkdown,
                description: this.state.description,
                theme: this.state.theme,
                //license: this.state.license,
                license: 'CC BY-SA',
                selector: this.props.selector,
                editors: {
                    old: this.props.DeckEditStore.originalEditors,
                    new: {
                        users: users,
                        groups: groups
                    }
                },
                tags: newTags,
                hidden: !this.state.published,
                educationLevel: this.state.educationLevel,
            });
            this.context.executeAction(updateTheme, this.state.theme);
        }
    }

    handleDelete(evt) {
        evt.preventDefault();
        console.log('handleDelete', this.state.users, this.state.groups, this.props.DeckEditStore.roots);
        console.log('handleDelete more data', this.props.selector, this.props.DeckEditStore);

        let isSubdeck = this.props.selector.spath || this.props.DeckEditStore.roots.length > 0;
        let hasSubdecks = this.props.DeckEditStore.deckProps.contentItems.filter((n) => n.kind === 'deck').length > 0;

        if (isSubdeck) {
            swal({
                title: 'Deck cannot be deleted',
                text: 'This deck appears to be used as a subdeck in some other deck. You can only delete decks when they are not used as subdecks.',
                type: 'warning',
                allowEscapeKey: true,
                showConfirmButton: true,
            });

            return;
        }

        if (hasSubdecks) {
            swal({
                title: 'Deck cannot be deleted',
                text: 'You can only delete decks when they have no subdecks. Please remove any subdecks first and try again',
                type: 'warning',
                allowEscapeKey: true,
                showConfirmButton: true,
            });

            return;
        }

        if (this.state.users.length < 1 && this.state.groups.length < 1) {
            let deckId = this.props.DeckEditStore.deckProps.sid.split('-')[0];
            // no editors - could just be deleted
            swal({
                title: 'Delete this deck?',
                text: `Do you really want to delete the deck: "${this.props.DeckEditStore.deckProps.title}" (ID: ${deckId})?`,
                type: 'question',
                showCloseButton: false,
                showCancelButton: true,
                allowEscapeKey: true,
                showConfirmButton: true
            })
            .then(() => {
                this.context.executeAction(deckDeletion, {id: deckId});
            }, (reason) => { // canceled
            });
        }
        else {
            // transfer ownership
            this.context.executeAction(loadEditors, {users: this.state.users, groups: this.state.groups});
        }

    }

    handleChange(fieldName, event) {
        let stateChange = {};
        stateChange[fieldName] = event.target.value;
        this.setState(stateChange);
    }

    handleDropdownChange(fieldName, event, data) {
        let stateChange = {};
        stateChange[fieldName] = data.value;
        this.setState(stateChange);
    }

    onChangeMarkdown(event) {
        this.setState({allowMarkdown: !this.state.allowMarkdown});
    }

    handleChangeCheckbox(fieldName, event, data) {
        let stateChange = {};
        stateChange[fieldName] = data.checked;
        this.setState(stateChange);
    }

    handleClickRemoveUser(member, event) {
        event.preventDefault();
        // console.log('handleClickRemoveUser', member, this.props.DeckEditStore.authorizedUsers);

        let users = this.props.DeckEditStore.authorizedUsers;

        let newMembers = users.filter((member2) => {
            return !(member2.username === member.username && member2.id === parseInt(member.id));
        });

        this.context.executeAction(updateAuthorizedUsers, newMembers);
    }

    handleClickRemoveGroup(group, event) {
        event.preventDefault();
        // console.log('handleClickRemoveGroup', group, this.props.DeckEditStore.authorizedGroups);

        let groups = this.props.DeckEditStore.authorizedGroups;

        let newGroups = groups.filter((group2) => {
            return !(group2.name === group.name && group2.id === parseInt(group.id));
        });

        this.context.executeAction(updateAuthorizedGroups, newGroups);
    }

    handleClickShowGroupDetails(groupid, event) {
        event.preventDefault();
        // console.log('handleClickShowGroupDetails', groupid, this.props.DeckEditStore.authorizedGroups);
        $('#app').attr('aria-hidden','true');
        //call service
        this.context.executeAction(loadUsergroup, {groupid: groupid});
    }

    getListOfAuthorized() {
        let list_authorized = [];
        if (this.props.DeckEditStore.authorizedUsers !== undefined && this.props.DeckEditStore.authorizedUsers.length > 0) {
            let counter = 1;
            this.props.DeckEditStore.authorizedUsers.forEach((user) => {
                let fct = (event) => {
                    this.handleClickRemoveUser(user, event);
                };
                let optionalElement = (user.organization || user.country) ?  (
                    <div>
                        {user.organization || 'Unknown organization'} ({user.country || 'unknown country'})
                        <br/>
                    </div>
                ) : '';
                let optionalText = (user.joined) ? ('Access granted '+timeSince((new Date(user.joined)))+' ago') : '';
                const key = 'user_' + counter + user.username + user.id;
                // console.log('new authorized user:', user);
                // console.log('New key for authorized user:', key, user);
                list_authorized.push(
                    (
                        <div className="item" key={key} >
                            <div className="ui grid">
                                <div className="one wide column">
                                    <UserPicture picture={ user.picture } username={ user.username } avatar={ true } width= { 24 } />
                                </div>
                                <div className="ten wide column">
                                    <div className="content">
                                        <TextArea className="sr-only" id={'usernameIsALinkHint' + key} value="The username is a link which will open a new browser tab. Close it when you want to go back to this page." tabIndex ='-1'/>
                                        <a className="header" href={'/user/' + user.username} target="_blank">{user.displayName || user.username}</a>
                                        <div className="description">
                                            {optionalElement}{optionalText}
                                        </div>
                                    </div>
                                </div>
                                <div className="four wide column middle aligned">
                                    <button className="ui tiny compact borderless black basic button" key={user.id} onClick={fct}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                );
                counter++;
            });
        }
        list_authorized.sort((a, b) => {
            return (a.key < b.key) ? -1 : 1;
        });

        let temp_list = [];
        if (this.props.DeckEditStore.authorizedGroups !== undefined && this.props.DeckEditStore.authorizedGroups.length > 0) {
            this.props.DeckEditStore.authorizedGroups.forEach((group) => {
                let fct = (event) => {
                    this.handleClickRemoveGroup(group, event);
                };
                let fct2 = (event) => {
                    this.handleClickShowGroupDetails(group.id, event);
                };
                let optionalText = (group.joined) ? ('Access granted '+timeSince((new Date(group.joined)))+' ago') : '';
                temp_list.push(
                    (
                        <div className="item" key={'group_' + group.id + group.name} >
                            <div className="ui grid">
                                <div className="one wide column">
                                    <i className="large group middle aligned icon"></i>
                                </div>
                                <div className="ten wide column">
                                    <div className="content">
                                        <a className="header">{group.name}</a>
                                        <div className="description">
                                            {optionalText}
                                        </div>
                                    </div>
                                </div>
                                <div className="four wide column middle aligned">
                                    <button className="ui tiny compact borderless black basic button" onClick={fct}>
                                        Remove
                                    </button>
                                    <button className="ui tiny compact borderless black basic button" key={group.id} onClick={fct2} >
                                        Show details
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                );
            });
        }
        temp_list.sort((a, b) => {
            return (a.key < b.key) ? -1 : 1;
        });

        list_authorized = list_authorized.concat(temp_list);

        return list_authorized;
    }

    render() {
        // console.log('render edit: published and roots', this.state.published, this.props.DeckEditStore.roots);
        //CSS
        let titleFieldClass = classNames({
            'required': true,
            'field': true,
            'error': this.state.validationErrors.title != null
        });
        /*
        let licenseFieldClass = classNames({
            'required': true,
            'field': true,
            'error': this.state.validationErrors.license != null
        });
        */
        let groupsFieldClass = classNames({
            'field': true,
        });

        //content elements
        let themeOptions = <select className="ui search dropdown" id="theme" aria-labelledby="theme"
                               value={this.state.theme}
                               onChange={this.handleChange.bind(this, 'theme')}>
                <option value="default">White - Default</option>
                <option value="beige">Cream</option>
                <option value="black">Black</option>
                <option value="league">Dark Grey</option>
                <option value="sky">Pale Blue</option>
                <option value="solarized">Beige</option>
                <option value="moon">Dark Slate Blue</option>
                <option value="night">High Contrast 1</option>
                <option value="blood">High Contrast 2</option>
                <option value="serif">Serif</option>
                <option value="simple">Simple</option>
                <option value="openuniversity">Open University</option>
                <option value="odimadrid">ODI Madrid</option>
                <option value="oeg">OEG</option>
            </select>;
        let licenseOptions = <a className="ui label">
                <i className="copyright large icon"></i>All decks are published under a <b>Creative Commons Attribution-ShareAlike</b> License
            </a>;
        /*
        <i className="creative commons large icon"></i>
        let licenseOptions = <select className="ui search dropdown" id="license" aria-labelledby="license"
                                     value={this.state.license}
                                     onChange={this.handleChange.bind(this, 'license')}>
           <option value="CC BY-SA" >Creative Commons Attribution-ShareAlike</option>
           <option value="CC BY" >Creative Commons Attribution</option>
           <option value="CC0" >Creative Commons CC0 Public Domain</option>
        </select>;
        //
        //
        */

        // TODO remove this once language codes have been fixed in code and database
        const fixedLanguageCodes = {
            'en': 'en_GB',
            'de': 'de_DE',
            'fr': 'fr_FR',
            'it': 'it_IT',
            'es': 'es_ES',
            'nl': 'nl_NL',
            'el': 'el_GR',
            'pt': 'pt_PT',
            'sr': 'sr_RS',
            'lt': 'lt_LT',
        };

        let groupsArray = [];
        if (this.props.groups) {
            this.props.groups.forEach((group) => {
                let data = {
                    id: group._id,
                    name: group.name
                };
                groupsArray.push((
                    <div key={group._id} className="item" data-value={encodeURIComponent(JSON.stringify(data))}>{group.name} ({group.members.length+1} member{((group.members.length+1) !== 1) ? 's': ''})</div>
                ));
            });
        }
        let groupsOptions = <div className="ui selection dropdown" id="deck_edit_dropdown_groups" aria-labelledby="groups"
                                ref="AddGroups">
                <input type="hidden" name="groups" />
                <i className="dropdown icon"></i>
                <div className="default text">Select Groups</div>
                <div className="menu">
                    {groupsArray}
                </div>
            </div>;

        let deleteButton = (this.props.PermissionsStore.permissions.admin && (this.props.DeckEditStore.deckProps.sid === this.props.DeckEditStore.deckProps.localRootDeck)) ? 
            <button className='ui negative right floated button'
                onClick={this.handleDelete.bind(this)}>Delete
            </button>
            : '';

        let buttons = (
            <div>
                {deleteButton}
                <button className='ui primary button'
                    onClick={this.handleSave.bind(this)}>Save
                </button>
                <button className="ui secondary button"
                    onClick={this.handleCancel.bind(this)}>
                    Cancel
                </button>
            </div>
        );

        // Now parts oh JAX in variables

        let listOfAuthorized = this.getListOfAuthorized();

        let titleField = <div className="field">
            <div className={titleFieldClass} data-tooltip={this.state.validationErrors.title}>
                <label htmlFor="title_input">
                    Title
                </label>
                <input type="text" name="deck-title" value={this.state.title}
                    onChange={this.handleChange.bind(this, 'title')} placeholder="Title"
                    aria-required="true" id="title_input"/>

            </div>
        </div>;
        let markdownField = <div className="field">
                <div className="ui checkbox">
                    <input type="checkbox" checked={this.state.allowMarkdown} onChange={this.onChangeMarkdown.bind(this)}/>
                    <label>Allow Markdown editing of slides</label>
                </div>
         </div>;

        let titleAndPublished = <div className="fields">
            <div className="sixteen wide field">{titleField}</div>
            <div className="two wide field">
                <label id="published_label">Published</label>
                <Checkbox toggle name='deck-published' aria-required aria-labelledby='published_label'
                    checked={this.state.published} onChange={this.handleChangeCheckbox.bind(this, 'published')} />
            </div>
        </div>;

        let description = <div className="field">
            <label htmlFor="description_input" id="deck-description">Description</label>
            <textarea rows="4" aria-labelledby="deck-description" id="description_input"
                value={this.state.description}
                onChange={this.handleChange.bind(this, 'description')}/>
        </div>;

        let themeAndLicence = <div className="two fields">
            <div className="field">
                <label htmlFor="theme" id="theme">Choose deck theme</label>
                {themeOptions}
            </div>
            <div className="field">
                <label htmlFor="license" id="license_label">License</label>
                {licenseOptions}
            </div>
        </div>;

        let levelAndTopics = <div className="two fields">
            <div className="sr-only" id="describe_level">Select education level of deck content</div>
            <div className="sr-only" id="describe_topic">Select subject of deck content from autocomplete. Multiple subjects can be selected"</div>
            <div className="field">
                <label htmlFor="level_input" id="level_label"><FormattedMessage id="DeckProperty.Education" defaultMessage="Education Level" /></label>
                <Dropdown id="level_input" fluid selection aria-labelledby="level_label" aria-describedby="describe_level"
                    options={ [{ value: null, text: '' }, ...Object.entries(educationLevels).map(([value, text]) => ({value, text}) )] }
                    value={this.state.educationLevel} onChange={this.handleDropdownChange.bind(this, 'educationLevel')} />
            </div>
            <div className="field">
                <label htmlFor="topics_input_field" id="topics_label"><FormattedMessage id="DeckProperty.Tag.Topic" defaultMessage="Subject" /></label>
                <TagInput id="topics_input_field" aria-labelledby="topics_label" aria-describedby="describe_topic"
                    ref={(i) => (this.topicInput = i)} tagFilter={{ tagType: 'topic' }} initialTags={this.state.topics} />
            </div>
        </div>;

        return (
            <div className="ui container">
                <div className="ui grid">
                    <div className="sixteen wide column">
                        <form className="ui form">
                            {titleAndPublished}
                            {description}
                            {themeAndLicence}
                            {markdownField}
                            {levelAndTopics}
                            {(this.props.PermissionsStore.permissions.admin && (this.props.DeckEditStore.deckProps.sid === this.props.DeckEditStore.deckProps.localRootDeck)) ? (
                                <div>
                                    <div className="two fields">
                                        <div className={groupsFieldClass}>
                                            <label htmlFor="deck_edit_dropdown_groups">Add groups for edit rights</label>
                                            {groupsOptions}
                                        </div>
                                        <div className={groupsFieldClass}>
                                            <label htmlFor="deck_edit_dropdown_usernames_remote">Add users for edit rights</label>
                                            <select className="ui search dropdown" aria-labelledby="AddUser" name="AddUser" ref="AddUser" id="deck_edit_dropdown_usernames_remote">
                                            </select>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="ui tiny header">
                                            Authorized:
                                        </div>
                                        <div className="ui very relaxed  list">
                                            {listOfAuthorized}
                                        </div>
                                        <div className="ui hidden divider">
                                        </div>
                                        <GroupDetailsModal ref="groupdetailsmodal_" group={this.props.DeckEditStore.detailedGroup} show={this.props.DeckEditStore.showGroupModal} />
                                        <TransferOwnership ref="transferownershipmodal_" users={this.props.DeckEditStore.allEditors} show={this.props.DeckEditStore.showTransferOwnershipModal} deckid={this.props.selector.id} />
                                    </div>
                                </div>
                            ) : ''}

                            <div className="ui hidden divider"></div>

                            {(this.props.DeckEditStore.viewstate === 'loading') ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}

                            {buttons}
                        </form>
                    </div>

                </div>
            </div>
        );

    }
}

DeckPropertiesEditor.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};

DeckPropertiesEditor = connectToStores(DeckPropertiesEditor, [DeckEditStore, TagsStore, PermissionsStore], (context, props) => {
    return {
        DeckEditStore: context.getStore(DeckEditStore).getState(),
        TagsStore: context.getStore(TagsStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});

export default DeckPropertiesEditor;
