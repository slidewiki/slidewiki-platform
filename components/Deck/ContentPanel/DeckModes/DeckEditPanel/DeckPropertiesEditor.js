import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Microservices } from '../../../../../configs/microservices';
import classNames from 'classnames';
import { connectToStores } from 'fluxible-addons-react';
import { navigateAction } from 'fluxible-router';
import { TextArea, Checkbox, Message, Form, Dropdown, Input } from 'semantic-ui-react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Util from '../../../../common/Util';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import saveDeckEdit from '../../../../../actions/saveDeckEdit';
import { updateAuthorizedUsers, updateAuthorizedGroups } from '../../../../../actions/updateDeckAuthorizations';
import updateDeckEditViewState from '../../../../../actions/updateDeckEditViewState';
import GroupDetailsModal from './GroupDetailsModal';
import { timeSince } from '../../../../../common';
import UserPicture from '../../../../common/UserPicture';
import loadUsergroup from '../../../../../actions/deckedit/loadUsergroup';
import TagsStore from '../../../../../stores/TagsStore';
import PermissionsStore from '../../../../../stores/PermissionsStore';
import updateTheme from '../../../../../actions/updateTheme';
import { showGroupDetailsModal } from '../../../../../actions/deckedit/functionsForGroupDetailsModal';

import { educationLevels } from '../../../../../lib/isced';
import TagInput from '../../../ContentModulesPanel/TagsPanel/TagInput';
import SWAutoComplete from '../../../../common/SWAutoComplete';

class DeckPropertiesEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getStateFromProps(props);

        this.messages = defineMessages({
            label_theme: {
                id: 'AddDeck.form.label_themes',
                defaultMessage: 'Deck theme',
            },
            label_education_label: {
                id: 'DeckProperty.Education.Choose',
                defaultMessage: 'Education Level',
            },
            label_topics: {
                id: 'DeckProperty.Tag.Topic.Choose',
                defaultMessage: 'Subject',
            },
            label_title: {
                id: 'DeckProperty.Deck.Title',
                defaultMessage: 'Title',
            },
        });
    }

    getStateFromProps(props) {
        let editors = props.deckProps.editors || {
            users: [],
            groups: [],
        };

        return {
            formValidationErrors: {},
            title: props.deckProps.title || '',
            allowMarkdown: props.deckProps.allowMarkdown || false,
            description: props.deckProps.description || '',
            theme: props.deckProps.theme || '',
            license: 'CC BY-SA',
            users: editors.users,
            groups: editors.groups,
            published: !props.deckProps.hidden,
            educationLevel: props.deckProps.educationLevel,
            tags: props.deckProps.tags || [],
            topics: props.deckProps.topics || [],
            selectedTopics: props.deckProps.topics ? props.deckProps.topics.map((topic) => topic.tagName) : [],
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
                    buttonsStyling: false,
                })
                    .then(() => {
                        return true;
                    })
                    .catch();
            } else if (newProps.DeckEditStore.viewstate === 'success') {
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
                        ƒ;
                        $('.swal2-confirm').focus();
                    },
                })
                    .then(() => {
                        return true;
                    })
                    .catch();
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
        $(ReactDOM.findDOMNode(this.refs.AddGroups)).dropdown({
            action: (someText, dataValue, source) => {
                // console.log('group dropdown select', dataValue);

                $(ReactDOM.findDOMNode(this.refs.AddGroups)).dropdown('clear');
                $(ReactDOM.findDOMNode(this.refs.AddGroups)).dropdown('hide');

                let groups = this.props.DeckEditStore.authorizedGroups;
                if (groups === undefined || groups === null) groups = [];

                let data = JSON.parse(decodeURIComponent(dataValue));
                if (
                    groups.findIndex((group) => {
                        return group.id === parseInt(data.id);
                    }) === -1
                ) {
                    groups.push({
                        name: data.name,
                        id: parseInt(data.id),
                        joined: new Date().toISOString(),
                    });
                }

                this.context.executeAction(updateAuthorizedGroups, groups);

                return true;
            },
        });

        $(ReactDOM.findDOMNode(this.refs.AddUser)).dropdown({
            apiSettings: {
                url: Microservices.user.uri + '/information/username/search/{query}',
                cache: false,
            },
            saveRemoteData: false,
            action: (name, value, source) => {
                let data = JSON.parse(decodeURIComponent(value));
                // console.log('user dropdown select', name, value, data);

                $(ReactDOM.findDOMNode(this.refs.AddUser)).dropdown('clear');
                $(ReactDOM.findDOMNode(this.refs.AddUser)).dropdown('hide');

                let users = this.props.DeckEditStore.authorizedUsers;
                if (users === undefined || users === null) users = [];

                // console.log('trying to add', name, 'to', users);
                if (
                    users.findIndex((member) => {
                        return member.id === parseInt(data.userid);
                    }) === -1 &&
                    parseInt(data.userid) !== this.props.userid
                ) {
                    users.push({
                        username: data.username,
                        id: parseInt(data.userid),
                        joined: data.joined || new Date().toISOString(),
                        picture: data.picture,
                        country: data.country,
                        organization: data.organization,
                        displayName: data.displayName,
                    });
                }

                this.context.executeAction(updateAuthorizedUsers, users);

                return true;
            },
        });
    }

    handleCancel(event) {
        event.preventDefault();

        this.context.executeAction(navigateAction, {
            url: Util.makeNodeURL(this.props.selector, this.props.selector.page, 'view'),
        });
    }

    handleSave(event) {
        event.preventDefault();
        let validationErrors = {};

        if (!this.state.title)
            validationErrors.title = this.context.intl.formatMessage({
                id: 'DeckPropertiesEditor.error.validation.title',
                defaultMessage: 'Please enter a title.',
            });

        let users = this.props.DeckEditStore.authorizedUsers;
        let groups = this.props.DeckEditStore.authorizedGroups;

        // for topics we need to merge with tags in state
        let newTags = this.state.selectedTopics;
        // as topics are never new, and we don't change the other tags, tagName is all we need
        newTags = newTags.map((tag) => ({ tagName: tag.replace(/^(existing\:)/, '') }));
        newTags = [...this.state.tags, ...newTags];
        this.setState({ formValidationErrors: validationErrors });

        // If there are no validation errors, save the new attributes.
        if (Object.keys(validationErrors).length === 0) {
            let deckId = this.props.selector.sid != null ? this.props.selector.sid : this.props.selector.id;

            this.context.executeAction(updateDeckEditViewState, 'loading');
            this.context.executeAction(saveDeckEdit, {
                deckId: deckId,
                title: this.state.title,
                allowMarkdown: this.state.allowMarkdown,
                description: this.state.description,
                theme: this.state.theme,
                license: 'CC BY-SA',
                selector: this.props.selector,
                editors: {
                    old: this.props.DeckEditStore.originalEditors,
                    new: {
                        users: users,
                        groups: groups,
                    },
                },
                tags: newTags,
                hidden: !this.state.published,
                educationLevel: this.state.educationLevel,
            });
            this.context.executeAction(updateTheme, this.state.theme);
        }
    }

    handleChange(fieldName, event) {
        let stateChange = {};
        stateChange[fieldName] = event.target.value;
        this.setState(stateChange);
    }

    onChangeMarkdown(event) {
        this.setState({ allowMarkdown: !this.state.allowMarkdown });
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
        $('#app').attr('aria-hidden', 'true');
        //call service
        this.context.executeAction(loadUsergroup, { groupid: groupid });
    }

    getListOfAuthorized() {
        let list_authorized = [];
        if (this.props.DeckEditStore.authorizedUsers !== undefined && this.props.DeckEditStore.authorizedUsers.length > 0) {
            let counter = 1;
            this.props.DeckEditStore.authorizedUsers.forEach((user) => {
                let fct = (event) => {
                    this.handleClickRemoveUser(user, event);
                };
                let optionalElement =
                    user.organization || user.country ? (
                        <div>
                            {user.organization || 'Unknown organization'} ({user.country || 'unknown country'})
                            <br />
                        </div>
                    ) : (
                        ''
                    );
                let optionalText = user.joined ? 'Access granted ' + timeSince(new Date(user.joined)) + ' ago' : '';
                const key = 'user_' + counter + user.username + user.id;
                // console.log('new authorized user:', user);
                // console.log('New key for authorized user:', key, user);
                list_authorized.push(
                    <div className='item' key={key}>
                        <div className='ui grid'>
                            <div className='one wide column'>
                                <UserPicture picture={user.picture} username={user.username} avatar={true} width={24} />
                            </div>
                            <div className='ten wide column'>
                                <div className='content'>
                                    <TextArea
                                        className='sr-only'
                                        id={'usernameIsALinkHint' + key}
                                        value='The username is a link which will open a new browser tab. Close it when you want to go back to this page.'
                                        tabIndex='-1'
                                    />
                                    <a className='header' href={'/user/' + user.username} target='_blank'>
                                        {user.displayName || user.username}
                                    </a>
                                    <div className='description'>
                                        {optionalElement}
                                        {optionalText}
                                    </div>
                                </div>
                            </div>
                            <div className='four wide column middle aligned'>
                                <button className='ui tiny compact borderless black basic button' key={user.id} onClick={fct}>
                                    <FormattedMessage id='deck.propertiesEditor.removeButton.text' defaultMessage='Remove' />
                                </button>
                            </div>
                        </div>
                    </div>
                );
                counter++;
            });
        }
        list_authorized.sort((a, b) => {
            return a.key < b.key ? -1 : 1;
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
                let optionalText = group.joined ? 'Access granted ' + timeSince(new Date(group.joined)) + ' ago' : '';
                temp_list.push(
                    <div className='item' key={'group_' + group.id + group.name}>
                        <div className='ui grid'>
                            <div className='one wide column'>
                                <i className='large group middle aligned icon'></i>
                            </div>
                            <div className='ten wide column'>
                                <div className='content'>
                                    <a className='header'>{group.name}</a>
                                    <div className='description'>{optionalText}</div>
                                </div>
                            </div>
                            <div className='four wide column middle aligned'>
                                <button className='ui tiny compact borderless black basic button' onClick={fct}>
                                    <FormattedMessage id='deck.propertiesEditor.removeButton.text' defaultMessage='Remove' />
                                </button>
                                <button className='ui tiny compact borderless black basic button' key={group.id} onClick={fct2}>
                                    <FormattedMessage id='deck.propertiesEditor.showDetails' defaultMessage='Show details' />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            });
        }
        temp_list.sort((a, b) => {
            return a.key < b.key ? -1 : 1;
        });

        list_authorized = list_authorized.concat(temp_list);

        return list_authorized;
    }

    handleDropdownChange = (e, dropdown) => {
        this.setState({
            [dropdown.id]: dropdown.value,
        });
    };

    handleInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    }

    render() {
        let groupsFieldClass = classNames({
            field: true,
        });

        const themeOptions = [
            {
                value: 'default',
                text: 'White - Default',
            },
            {
                value: 'beige',
                text: 'Cream',
            },
            {
                value: 'black',
                text: 'Black',
            },
            {
                value: 'league',
                text: 'Dark Grey',
            },
            {
                value: 'sky',
                text: 'Pale Blue',
            },
            {
                value: 'solarized',
                text: 'Beige',
            },
            {
                value: 'moon',
                text: 'Dark Slate Blue',
            },
            {
                value: 'night',
                text: 'High Contrast 1',
            },
            {
                value: 'blood',
                text: 'High Contrast 2',
            },
            {
                value: 'serif',
                text: 'Serif',
            },
            {
                value: 'simple',
                text: 'Simple',
            },
            {
                value: 'openuniversity',
                text: 'Open University',
            },
            {
                value: 'odimadrid',
                text: 'ODI Madrid',
            },
            {
                value: 'OEG',
                text: 'OEG',
            },
        ];

        let licenseOptions = (
            <a className='ui label'>
                <i className='copyright large icon'></i>
                <FormattedMessage id='deck.propertiesEditor.license.part1' defaultMessage='All decks are published under a' />{' '}
                <b>Creative Commons Attribution-ShareAlike</b> <FormattedMessage id='deck.propertiesEditor.license.part2' defaultMessage='License' />
            </a>
        );

        let groupsArray = [];
        if (this.props.groups) {
            this.props.groups.forEach((group) => {
                let data = {
                    id: group._id,
                    name: group.name,
                };
                groupsArray.push(
                    <div key={group._id} className='item' data-value={encodeURIComponent(JSON.stringify(data))}>
                        {group.name} ({group.members.length + 1} member{group.members.length + 1 !== 1 ? 's' : ''})
                    </div>
                );
            });
        }
        let groupsOptions = (
            <div className='ui selection dropdown' id='deck_edit_dropdown_groups' aria-labelledby='groups' ref='AddGroups'>
                <input type='hidden' name='groups' />
                <i className='dropdown icon'></i>
                <div className='default text'>
                    <FormattedMessage id='deck.propertiesEditor.selectGroup' defaultMessage='Select Groups' />
                </div>
                <div className='menu'>{groupsArray}</div>
            </div>
        );

        let buttons = (
            <div>
                <button className='ui primary button' onClick={this.handleSave.bind(this)}>
                    <FormattedMessage id='deck.propertiesEditor.save' defaultMessage='Save' />
                </button>
                <button className='ui secondary button' onClick={this.handleCancel.bind(this)}>
                    <FormattedMessage id='deck.propertiesEditor.cancel' defaultMessage='Cancel' />
                </button>
            </div>
        );

        // Now parts oh JAX in variables

        let listOfAuthorized = this.getListOfAuthorized();

        /*let titleField = <div className="field">
            <div className={titleFieldClass}>
                <label htmlFor="title_input">
                    Title
                </label>
                <input type="text" name="deck-title" value={this.state.title}
                    onChange={this.handleChange.bind(this, 'title')} placeholder="Title"
                    aria-required="true" id="title_input"/>

            </div>
        </div>;*/
        let titleField = (
            <Form.Field
                id='title'
                control={Input}
                label={this.context.intl.formatMessage(this.messages.label_title)}
                required
                value={this.state.title}
                onChange={this.handleInputChange}
                error={
                    this.state.formValidationErrors.title
                        ? {
                              content: this.state.formValidationErrors.title,
                          }
                        : undefined
                }
            />
        );

        let markdownField = (
            <div className='field'>
                <div className='ui checkbox'>
                    <label>
                        <input type='checkbox' checked={this.state.allowMarkdown} onChange={this.onChangeMarkdown.bind(this)} />
                        <FormattedMessage id='deck.propertiesEditor.allow.text' defaultMessage='Use Markdown by default for new slides' />
                    </label>
                </div>
            </div>
        );

        let titleAndPublished = (
            <div className='fields'>
                <div className='sixteen wide field'>{titleField}</div>
                <div className='two wide field'>
                    <label id='published_label'>
                        <FormattedMessage id='deck.propertiesEditor.publishCheckbox' defaultMessage='Published' />
                    </label>
                    <Checkbox
                        toggle
                        name='deck-published'
                        aria-required
                        aria-labelledby='published_label'
                        checked={this.state.published}
                        onChange={this.handleChangeCheckbox.bind(this, 'published')}
                    />
                </div>
            </div>
        );

        let description = (
            <div className='field'>
                <label htmlFor='description_input' id='deck-description'>
                    Description
                </label>
                <textarea
                    rows='4'
                    aria-labelledby='deck-description'
                    id='description_input'
                    value={this.state.description}
                    onChange={this.handleChange.bind(this, 'description')}
                />
            </div>
        );

        let themeAndLicence = (
            <div className='two fields'>
                <Form.Field
                    id='theme'
                    control={Dropdown}
                    label={this.context.intl.formatMessage(this.messages.label_theme)}
                    selection
                    value={this.state.theme}
                    onChange={this.handleDropdownChange}
                    options={themeOptions}
                />
                <div className='field'>
                    <label htmlFor='license' id='license_label'>
                        <FormattedMessage id='deck.propertiesEditor.license' defaultMessage='License' />
                    </label>
                    {licenseOptions}
                </div>
            </div>
        );

        let levelAndTopics = (
            <div className='two fields'>
                <div className='sr-only' id='describe_level'>
                    <FormattedMessage id='deck.propertiesEditor.selectLevel.text' defaultMessage='Select education level of deck content' />
                </div>
                <div className='sr-only' id='describe_topic'>
                    <FormattedMessage
                        id='deck.propertiesEditor.selectSubject.text'
                        defaultMessage='Select subject of deck content from autocomplete. Multiple subjects can be selected'
                    />
                </div>

                <Form.Field
                    id='educationLevel'
                    control={Dropdown}
                    label={this.context.intl.formatMessage(this.messages.label_education_label)}
                    selection
                    search
                    clearable
                    value={this.state.educationLevel}
                    onChange={this.handleDropdownChange}
                    options={Object.entries(educationLevels).map(([value, text]) => ({
                        value,
                        text,
                    }))}
                />
                <TagInput
                    id='selectedTopics'
                    initialOptions={this.state.topics}
                    tagFilter={{ tagType: 'topic' }}
                    value={this.state.selectedTopics}
                    onChange={this.handleDropdownChange}
                    label={this.context.intl.formatMessage(this.messages.label_topics)}
                />
            </div>
        );

        return (
            <div className='ui container'>
                <div className='ui grid'>
                    <div className='sixteen wide column'>
                        <form className='ui form'>
                            {titleAndPublished}
                            {description}
                            {themeAndLicence}
                            {markdownField}
                            {levelAndTopics}
                            {this.props.PermissionsStore.permissions.admin &&
                            this.props.DeckEditStore.deckProps.sid === this.props.DeckEditStore.deckProps.localRootDeck ? (
                                <div>
                                    <div className='two fields'>
                                        <div className={groupsFieldClass}>
                                            <label htmlFor='deck_edit_dropdown_groups'>
                                                <FormattedMessage id='deck.propertiesEditor.addGroups' defaultMessage='Add groups for edit rights' />
                                            </label>
                                            {groupsOptions}
                                        </div>
                                        <div className={groupsFieldClass}>
                                            <label htmlFor='deck_edit_dropdown_usernames_remote'>
                                                <FormattedMessage id='deck.propertiesEditor.addUsers' defaultMessage='Add users for edit rights' />
                                            </label>
                                            <select
                                                className='ui search dropdown'
                                                aria-labelledby='AddUser'
                                                name='AddUser'
                                                ref='AddUser'
                                                id='deck_edit_dropdown_usernames_remote'
                                            ></select>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <div className='ui tiny header'>
                                            <FormattedMessage id='deck.propertiesEditor.authorized' defaultMessage='Authorized' />:
                                        </div>
                                        <div className='ui very relaxed  list'>{listOfAuthorized}</div>
                                        <div className='ui hidden divider'></div>
                                        <GroupDetailsModal
                                            ref='groupdetailsmodal_'
                                            group={this.props.DeckEditStore.detailedGroup}
                                            show={this.props.DeckEditStore.showGroupModal}
                                        />
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}

                            <div className='ui hidden divider'></div>

                            {this.props.DeckEditStore.viewstate === 'loading' ? (
                                <div className='ui active dimmer'>
                                    <div className='ui text loader'>Loading</div>
                                </div>
                            ) : (
                                ''
                            )}

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
    intl: PropTypes.object.isRequired,
};

DeckPropertiesEditor = connectToStores(DeckPropertiesEditor, [DeckEditStore, TagsStore, PermissionsStore], (context, props) => {
    return {
        DeckEditStore: context.getStore(DeckEditStore).getState(),
        TagsStore: context.getStore(TagsStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState(),
    };
});

export default DeckPropertiesEditor;
