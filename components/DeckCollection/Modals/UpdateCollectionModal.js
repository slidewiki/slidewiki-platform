import React from 'react';
import {navigateAction} from 'fluxible-router';
import {Button, Icon, Modal, Header, Form, Dropdown, Segment, TextArea} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import updateCollectionMetadata from '../../../actions/collections/updateCollectionMetadata';
import {FormattedMessage, defineMessages} from 'react-intl';

class UpdateCollectionModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.collection.id || '',
            title: this.props.collection.title || '', 
            description: this.props.collection.description || '',
            userGroup: this.props.collection.userGroup || '', 
            validationError: false
        };

        this.messages = this.getIntlMessages();
    }
    componentWillReceiveProps(props){
        let collection = props.collection;

        this.setState({
            id: collection._id, 
            title: collection.title, 
            description: collection.description, 
            userGroup: collection.userGroup
        });
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
        return (this.state.title && this.state.title !== '');
    }
    handleSave(event) {
        event.preventDefault();

        if(!this.validateForm()){
            this.setState({
                validationError: true
            });
            return;
        }

        let title = this.context.intl.formatMessage(this.messages.updateCollectionSuccessTitle);
        let text = this.context.intl.formatMessage(this.messages.updateCollectionSuccessText);

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

        this.context.executeAction(updateCollectionMetadata, {
            id: this.state.id,
            title: this.state.title, 
            description: this.state.description,
            userGroup: this.state.userGroup
        });

        this.handleClose();
    }
    getIntlMessages(){
        return defineMessages({
            modalTitle: {
                id: 'UpdateCollectionModal.title',
                defaultMessage: 'Update Deck Collection'
            }, 
            titleField: {
                id: 'UpdateCollectionModal.field.title',
                defaultMessage: 'Title'
            }, 
            titleFieldPlaceholder: {
                id: 'UpdateCollectionModal.field.title.placeholder',
                defaultMessage: 'Deck Collection Title'
            }, 
            descriptionField: {
                id: 'UpdateCollectionModal.field.description',
                defaultMessage: 'Description'
            }, 
            descriptionFieldPlaceholder: {
                id: 'UpdateCollectionModal.field.description.placeholder',
                defaultMessage: 'Deck Collection Description'
            }, 
            usergroupField: {
                id: 'UpdateCollectionModal.field.usergroup',
                defaultMessage: 'User Group'
            }, 
            usergroupFieldPlaceholder: {
                id: 'UpdateCollectionModal.field.usergroup.placeholder',
                defaultMessage: 'Select User Group'
            }, 
            buttonSave: {
                id: 'UpdateCollectionModal.button.save',
                defaultMessage: 'Save'
            }, 
            buttonClose: {
                id: 'UpdateCollectionModal.button.close',
                defaultMessage: 'Close'
            }, 
            updateCollectionSuccessTitle: {
                id: 'UpdateCollectionModal.success.title',
                defaultMessage: 'Update Deck Collection'
            }, 
            updateCollectionSuccessText: {
                id: 'UpdateCollectionModal.success.text',
                defaultMessage: 'We are updating the Deck Collection...'
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
                id="updateCollectioModal"
                dimmer='blurring' 
                size='small' 
                role='dialog' 
                aria-labelledby='updateCollectionModalHeader'
                aria-describedby='updateCollectionDescription' 
                aria-hidden = {!this.props.isOpen}
                tabIndex="0"
                open={this.props.isOpen}
                onClose={this.props.handleClose}>

                <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.isOpen} className="header">
                    <Header content={this.context.intl.formatMessage(this.messages.modalTitle)} id='updateCollectionModalHeader'/>
                    <Modal.Content>
                       <TextArea className="sr-only" id="updateCollectionDescription" value="Update a deck collection" tabIndex ='-1'/>
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
                                <Dropdown id="col_user_group" placeholder={this.context.intl.formatMessage(this.messages.usergroupFieldPlaceholder)} fluid selection options={userGroupOptions} onChange={this.handleUserGroupChange.bind(this)} value={this.state.userGroup} />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Segment basic textAlign="center">
                            <div>
                                <Button primary as='button' onClick={this.handleSave.bind(this)}><Icon name='save'/><FormattedMessage {...this.messages.buttonSave} /></Button>
                                <Button as='button' onClick={this.handleClose.bind(this)}><Icon name='close'/><FormattedMessage {...this.messages.buttonClose} /></Button>
                            </div>
                        </Segment>
                    </Modal.Actions>
                </FocusTrap>
            </Modal>
        );
    }
}

UpdateCollectionModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired, 
    intl: React.PropTypes.object.isRequired
};

export default UpdateCollectionModal;
