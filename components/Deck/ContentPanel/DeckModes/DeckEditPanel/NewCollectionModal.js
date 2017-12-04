import React from 'react';
import {navigateAction} from 'fluxible-router';
import {Button, Icon, Modal, Header, Form, Dropdown} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import addNewCollection from '../../../../../actions/collections/addNewCollection';

class NewCollectionModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title || '', 
            description: this.props.description || '',
            userGroup: this.props.userGroup || '', 
            validationError: false
        };
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

        swal({
            title: 'New Deck Group',
            text: 'We are creating a new Deck Group...',
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
    render() {
        let userGroupOptions = this.props.userGroups.map( (userGroup) => ({
                text: `${userGroup.name} (${userGroup.members.length+1} member${((userGroup.members.length+1) !== 1) ? 's': ''})`,
                value: userGroup._id
        }));

        return (
            <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='forkModalHeader'
                   aria-describedby='forkModalDesc' open={this.props.isOpen}
                   onClose={this.props.handleClose}>
                <Header content='Create a new Deck Collection' id='forkModalHeader'/>
                <Modal.Content>
                <Form>
                    <Form.Field required error={this.state.validationError}>
                        <label>Title</label>
                        <input placeholder='Deck Collection Title' value={this.state.title} onChange={this.handleChange.bind(this, 'title')} />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <input placeholder='Deck Collection Description' value={this.state.description} onChange={this.handleChange.bind(this, 'description')} />
                    </Form.Field>
                    <Form.Field>
                        <label htmlFor="user_group_of_new_deck_group">User Group</label>
                        <Dropdown placeholder="Select User Group" fluid selection options={userGroupOptions} onChange={this.handleUserGroupChange.bind(this)} />
                    </Form.Field>
                </Form>
                </Modal.Content>
                <Modal.Actions>
                    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.isOpen}>
                        <div>
                            <Button primary as='button' onClick={this.handleSave.bind(this)}><Icon name='save'/>Create</Button>
                            <Button as='button' onClick={this.handleClose.bind(this)}><Icon name='close'/>Close</Button>
                        </div>
                    </FocusTrap>
                </Modal.Actions>
            </Modal>
        );
    }
}

NewCollectionModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default NewCollectionModal;
