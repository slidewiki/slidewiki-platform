import React from 'react';
import {navigateAction} from 'fluxible-router';
import {Button, Icon, Modal, Header, Form} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import addNewDeckGroup from '../../../../../actions/deckGroups/addNewDeckGroup';

class NewDeckGroupModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title || '', 
            description: this.props.description || '', 
            validationError: false
        };
    }
    // navigateToFork() {
    //     let lastUpdatedFork = _.maxBy(this.props.forks, (fork) => new Date(fork.lastUpdate));
    //     this.context.executeAction(navigateAction, {
    //         url: '/deck/' + lastUpdatedFork.id
    //     });
    //     this.props.handleClose();
    // }
    handleChange(fieldName, event) {
        let stateChange = {};
        stateChange[fieldName] = event.target.value;
        this.setState(stateChange);
    }

    handleClose(){
        this.clearInputFields();
        this.props.handleClose();
    }

    clearInputFields(){
        this.setState({
            title: '', 
            description: '', 
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

        this.context.executeAction(addNewDeckGroup, {
            title: this.state.title, 
            description: this.state.description
        });

        this.handleClose();
    }
    render() {
        return (
            <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='forkModalHeader'
                   aria-describedby='forkModalDesc' open={this.props.isOpen}
                   onClose={this.props.handleClose}>
                <Header content='Create a new Deck Group' id='forkModalHeader'/>
                <Modal.Content>
                <Form>
                    <Form.Field required error={this.state.validationError}>
                        <label>Title</label>
                        <input placeholder='Deck Group Title' value={this.state.title} onChange={this.handleChange.bind(this, 'title')} />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <input placeholder='Deck Group Description' value={this.state.description} onChange={this.handleChange.bind(this, 'description')} />
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

NewDeckGroupModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default NewDeckGroupModal;
