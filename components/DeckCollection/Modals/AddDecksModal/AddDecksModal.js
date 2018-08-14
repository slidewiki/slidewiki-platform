import PropTypes from 'prop-types';
import React from 'react';
import {navigateAction} from 'fluxible-router';
import {Button, Icon, Modal, Header, Form, Dropdown, Segment, TextArea, Menu} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import {FormattedMessage, defineMessages} from 'react-intl';

class AddDecksModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'myDecksTab',

            // title: this.props.title || '', 
            // description: this.props.description || '',
            // userGroup: this.props.userGroup || '', 
            // validationError: false
        };

        this.messages = this.getIntlMessages();
    }
    handleMenuClick(e, { id }){
        this.setState({ activeItem: id });
    }
    handleChange(fieldName, event) {
    //     let stateChange = {};
    //     stateChange[fieldName] = event.target.value;
    //     this.setState(stateChange);
    // }
    // handleUserGroupChange(event, data){
    //     this.setState({
    //         userGroup: data.value
    //     });
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
        // event.preventDefault();

        // if(!this.validateForm()){
        //     this.setState({
        //         validationError: true
        //     });
        //     return;
        // }
        // let title = this.context.intl.formatMessage(this.messages.newCollectionSuccessTitle);
        // let text = this.context.intl.formatMessage(this.messages.newCollectionSuccessText);

        // swal({
        //     title: title,
        //     text: text,
        //     type: 'success',
        //     timer: 2000,
        //     showCloseButton: false,
        //     showCancelButton: false,
        //     allowEscapeKey: false,
        //     showConfirmButton: false
        // })
        // .then(() => {/* Confirmed */}, (reason) => {/* Canceled */});

        // // this.context.executeAction(addNewCollection, {
        // //     title: this.state.title, 
        // //     description: this.state.description,
        // //     userGroup: this.state.userGroup
        // // });

        this.handleClose();
    }
    getIntlMessages(){
        return defineMessages({
            modalTitle: {
                id: 'AddDecksToCollectionModal.title',
                defaultMessage: 'Add decks to playlist'
            }, 
            fromMyDecksTitle: {
                id: 'AddDecksToCollectionModal.fromMyDecks',
                defaultMessage: 'From My Decks'
            }, 
            fromSlidewikiTitle: {
                id: 'AddDecksToCollectionModal.fromSlidewiki',
                defaultMessage: 'From Slidewiki'                
            },
            buttonAdd: {
                id: 'AddDecksToCollectionModal.button.add',
                defaultMessage: 'Add'
            }, 
            buttonClose: {
                id: 'AddDecksToCollectionModal.button.close',
                defaultMessage: 'Close'
            }, 

        });
    }
    render() {

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
                        <Menu attached='top' tabular role="tablist">
                           <Menu.Item name={this.context.intl.formatMessage(this.messages.fromMyDecksTitle)} id="myDecksTab" active={this.state.activeItem === 'myDecksTab'} aria-selected={this.state.activeItem === 'myDecksTab'} onClick={this.handleMenuClick.bind(this)} role="tab" tabIndex="0" />
                           <Menu.Item name={this.context.intl.formatMessage(this.messages.fromSlidewikiTitle)} id="slidewikiTab" active={this.state.activeItem === 'slidewikiTab'} aria-selected={this.state.activeItem === 'slidewikiTab'} onClick={this.handleMenuClick.bind(this)} role="tab" tabIndex="0" />
                         </Menu>
                    </Modal.Content>

                    <Modal.Actions>
                        <Segment basic textAlign="center">
                            <div>
                                <Button primary as='button' onClick={this.handleSave.bind(this)}><Icon name='plus'/><FormattedMessage {...this.messages.buttonAdd} /></Button>
                                <Button as='button' onClick={this.handleClose.bind(this)}><Icon name='close'/><FormattedMessage {...this.messages.buttonClose} /></Button>
                            </div>
                        </Segment>
                    </Modal.Actions>
                </FocusTrap>
            </Modal>
        );
    }
}

AddDecksModal.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

export default AddDecksModal;