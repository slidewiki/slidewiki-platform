import React from 'react';
import {navigateAction} from 'fluxible-router';
import {Button, Icon, Modal, Header, Form, Dropdown, Segment, TextArea} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import addNewCollection from '../../../actions/collections/addNewCollection';
import {FormattedMessage, defineMessages} from 'react-intl';

class NewCollectionModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title || '', 
            description: this.props.description || '',
            userGroup: this.props.userGroup || '', 
            validationError: false
        };

        this.messages = this.getIntlMessages();
    }
    handleChange(fieldName, event) {
        let stateChange = {};
        stateChange[fieldName] = event.target.value;
        this.setState(stateChange);
    }
    handleUserGroupChange(event, data){
        this.setState({
            userGroup: data.value
        });
    }
    handleClose(){
        this.clearInputFields();
        this.props.handleClose();
    }

    clearInputFields(){
        this.setState({
            title: '', 
            description: '', 
            userGroup: '',
            validationError: false
        });
    }
    validateForm(){
        // check if a non-empty title was given
        return (this.state.title && this.state.title.trim() !== '');
    }
    handleSave(event) {
        event.preventDefault();

        if(!this.validateForm()){
            this.setState({
                validationError: true
            });
            return;
        }
        let title = this.context.intl.formatMessage(this.messages.newCollectionSuccessTitle);
        let text = this.context.intl.formatMessage(this.messages.newCollectionSuccessText);

        swal({
            title: title,
            text: text,
            type: 'success',
            timer: 2000,
            showCloseButton: false,
            showCancelButton: false,
            allowEscapeKey: false,
            showConfirmButton: false
        })
        .then(() => {/* Confirmed */}, (reason) => {/* Canceled */});

        this.context.executeAction(addNewCollection, {
            title: this.state.title, 
            description: this.state.description,
            userGroup: this.state.userGroup
        });

        this.handleClose();
    }
    getIntlMessages(){
        return defineMessages({
            modalTitle: {
                id: 'NewCollectionModal.title',
                defaultMessage: 'Create a new Playlists'
            }, 
            titleField: {
                id: 'NewCollectionModal.field.title',
                defaultMessage: 'Title'
            }, 
            titleFieldPlaceholder: {
                id: 'NewCollectionModal.field.title.placeholder',
                defaultMessage: 'Playlist Title'
            }, 
            descriptionField: {
                id: 'NewCollectionModal.field.description',
                defaultMessage: 'Description'
            }, 
            descriptionFieldPlaceholder: {
                id: 'NewCollectionModal.field.description.placeholder',
                defaultMessage: 'Playlist Description'
            }, 
            usergroupField: {
                id: 'NewCollectionModal.field.usergroup',
                defaultMessage: 'User Group'
            }, 
            usergroupFieldPlaceholder: {
                id: 'NewCollectionModal.field.usergroup.placeholder',
                defaultMessage: 'Select User Group'
            }, 
            buttonCreate: {
                id: 'NewCollectionModal.button.create',
                defaultMessage: 'Create'
            }, 
            buttonClose: {
                id: 'NewCollectionModal.button.close',
                defaultMessage: 'Close'
            }, 
            newCollectionSuccessTitle: {
                id: 'NewCollectionModal.success.title',
                defaultMessage: 'New Playlist'
            }, 
            newCollectionSuccessText: {
                id: 'NewCollectionModal.success.text',
                defaultMessage: 'We are creating a new Playlist...'
            }

        });
    }
    render() {

        // the user can assign a user group to a collection only if he is the creator of the user group
        let userGroupOptions = (this.props.userGroups || []).filter( (userGroup) => {
            return (userGroup.creator.userid === this.props.loggedInUser);
        }).map( (userGroup) => ({
            text: `${userGroup.name} (${userGroup.members.length+1} member${((userGroup.members.length+1) !== 1) ? 's': ''})`,
            value: userGroup._id
        }));

        userGroupOptions.unshift({
            text: 'Select User Group', 
            value: ''
        });

        return (
            <Modal 
                id="newCollectioModal"
                dimmer='blurring' 
                size='small' 
                role='dialog' 
                aria-labelledby='addNewCollectionHeader'
                aria-describedby='addNewCollectionDescription'
                aria-hidden = {!this.props.isOpen}
                tabIndex="0"
                open={this.props.isOpen}
                onClose={this.props.handleClose}>

                <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.isOpen} className="header">
                    <Modal.Header  as="h1" content={this.context.intl.formatMessage(this.messages.modalTitle)} id='addNewCollectionHeader'/>
                    <Modal.Content>
                       <TextArea className="sr-only" id="addNewCollectionDescription" value="Create a new deck collection" tabIndex ='-1'/>
                        <Form>
                            <Form.Field required error={this.state.validationError}>
                                <label htmlFor="col_title"><FormattedMessage {...this.messages.titleField} /></label>
                                <input id="col_title" placeholder={this.context.intl.formatMessage(this.messages.titleFieldPlaceholder)} value={this.state.title} onChange={this.handleChange.bind(this, 'title')} aria-required="true" />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="col_description"><FormattedMessage {...this.messages.descriptionField} /></label>
                                <input id="col_description" placeholder={this.context.intl.formatMessage(this.messages.descriptionFieldPlaceholder)} value={this.state.description} onChange={this.handleChange.bind(this, 'description')} />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="col_user_group"><FormattedMessage {...this.messages.usergroupField} /></label>
                                <Dropdown id="col_user_group" placeholder={this.context.intl.formatMessage(this.messages.usergroupFieldPlaceholder)} fluid selection options={userGroupOptions} onChange={this.handleUserGroupChange.bind(this)} />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Segment basic textAlign="center">
                            <div>
                                <Button primary as='button' onClick={this.handleSave.bind(this)}><Icon name='save'/><FormattedMessage {...this.messages.buttonCreate} /></Button>
                                <Button as='button' onClick={this.handleClose.bind(this)}><Icon name='close'/><FormattedMessage {...this.messages.buttonClose} /></Button>
                            </div>
                        </Segment>
                    </Modal.Actions>
                </FocusTrap>
            </Modal>
        );
    }
}

NewCollectionModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired, 
    intl: React.PropTypes.object.isRequired
};

export default NewCollectionModal;
