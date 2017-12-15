import React from 'react';
import {navigateAction} from 'fluxible-router';
import {Button, Icon, Modal, Header, Form, Dropdown} from 'semantic-ui-react';
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
                defaultMessage: 'Create a new Deck Collection'
            }, 
            titleField: {
                id: 'NewCollectionModal.field.title',
                defaultMessage: 'Title'
            }, 
            titleFieldPlaceholder: {
                id: 'NewCollectionModal.field.title.placeholder',
                defaultMessage: 'Deck Collection Title'
            }, 
            descriptionField: {
                id: 'NewCollectionModal.field.description',
                defaultMessage: 'Description'
            }, 
            descriptionFieldPlaceholder: {
                id: 'NewCollectionModal.field.description.placeholder',
                defaultMessage: 'Deck Collection Description'
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
                defaultMessage: 'New Deck Collection'
            }, 
            newCollectionSuccessText: {
                id: 'NewCollectionModal.success.text',
                defaultMessage: 'We are creating a new Deck Collection...'
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

        return (
            <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='addNewCollectionHeader'
                   aria-describedby='addNewCollectionHeaderDescr' open={this.props.isOpen}
                   onClose={this.props.handleClose}>
                <Header content={this.context.intl.formatMessage(this.messages.modalTitle)} id='addNewCollectionHeader'/>
                <Modal.Content>
                <Form>
                    <Form.Field required error={this.state.validationError}>
                        <label><FormattedMessage {...this.messages.titleField} /></label>
                        <input placeholder={this.context.intl.formatMessage(this.messages.titleFieldPlaceholder)} value={this.state.title} onChange={this.handleChange.bind(this, 'title')} />
                    </Form.Field>
                    <Form.Field>
                        <label><FormattedMessage {...this.messages.descriptionField} /></label>
                        <input placeholder={this.context.intl.formatMessage(this.messages.descriptionFieldPlaceholder)} value={this.state.description} onChange={this.handleChange.bind(this, 'description')} />
                    </Form.Field>
                    <Form.Field>
                        <label htmlFor="user_group_of_new_deck_group"><FormattedMessage {...this.messages.usergroupField} /></label>
                        <Dropdown placeholder={this.context.intl.formatMessage(this.messages.usergroupFieldPlaceholder)} fluid selection options={userGroupOptions} onChange={this.handleUserGroupChange.bind(this)} />
                    </Form.Field>
                </Form>
                </Modal.Content>
                <Modal.Actions>
                    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.isOpen}>
                        <div>
                            <Button primary as='button' onClick={this.handleSave.bind(this)}><Icon name='save'/><FormattedMessage {...this.messages.buttonCreate} /></Button>
                            <Button as='button' onClick={this.handleClose.bind(this)}><Icon name='close'/><FormattedMessage {...this.messages.buttonClose} /></Button>
                        </div>
                    </FocusTrap>
                </Modal.Actions>
            </Modal>
        );
    }
}

NewCollectionModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired, 
    intl: React.PropTypes.object.isRequired
};

export default NewCollectionModal;
