import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { Button, Modal, Card, Image } from 'semantic-ui-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import DeckTreeStore from '../../../../stores/DeckTreeStore';
import FocusTrap from 'focus-trap-react';
import insertOerContent from '../../../../actions/slide/insertOerContent';

class AttachOerModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            activeTrap: false
        };
    }

    // Opening the modal
    handleOpen = () => {
        // App is hidden for screen readers when the modal is open
        $('#app').attr('aria-hidden', 'true');

        // Open the actual modal
        this.setState({
            modalOpen: true,
            activeTrap: true
        });
    }

    // Close the modal
    handleClose = () => {
        $('#app').attr('aria-hidden', 'false');

        this.setState({
            modalOpen: false,
            activeTrap: false,
        });
    }

    // Needed for accessibility (keep the focus inside the modal)
    unmountTrap = () => {
        if (this.state.activeTrap) {
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden', 'false');
        }
    }

    // Ensure that button also works with keyboard (for accessibility)
    handleKeyPress = (event, param) => {
        // On enter on button, open the modal
        if(event.key === 'Enter'){
            switch(param) {
                case 'handleAddOer':
                    this.handleOpen();
                    break;
                default: 
                    break;
            }
        }
    }

    // This functions handles the clicked OER resource, the resource
    // id can be passed to find out what resources has been selected
    handleOerClick = (resourceId) => {
        console.log('Selected resource', resourceId);
        this.handleClose();
        // Add the OER content in the slide 
        this.context.executeAction(insertOerContent, {
            // Only use JSX as oerContent payload!
            oerContent:
                <a href="http://tib.eu" target="_blank" rel="noopener noreferrer">Test oer link</a>
        });
    };

    render() {
        // The button that is being added in the slideEditLeftPanel
        let attachButton = (
            <a
                className='item'
                id='handleAddQuestionsModal'
                role='button'
                aria-hidden={this.state.modalOpen}
                onClick={this.handleOpen}
                onKeyPress={(evt) =>
                    this.handleKeyPress(evt, 'handleAddOer')
                }
                tabIndex={this.props.buttonStyle.noTabIndex ? -1 : 0}
            >
                <i className='content icon' /> Add OER
            </a>
        );

        return (
            <FocusTrap
                id='focus-trap-attach-oer'
                focusTrapOptions={{
                    onDeactivate: this.unmountTrap,
                    clickOutsideDeactivates: true,
                    initialFocus: '#cancelAttachOer'
                }}
                active={this.state.activeTrap}
            >
                <Modal
                    trigger={attachButton}
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    role='dialog'
                    id='attachOerModal'
                    aria-labelledby='attachOerHeader'
                    aria-hidden={!this.state.modalOpen}
                    tabIndex='0'
                    //size="large" // Enable the change the size of the modal
                >
                    <Modal.Header as='h1' id='attachOerHeader'>
                        Select Open Educational Resources
                    </Modal.Header>

                    <Modal.Content>
                        <Card.Group>
                            <Card onClick={() => this.handleOerClick(1)}>
                                <Image
                                    src='https://react.semantic-ui.com/images/avatar/large/matthew.png'
                                    wrapped
                                    ui={false}
                                />
                                <Card.Content>
                                    <Card.Header>OER file</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>
                                            Create on July 12, 2019
                                        </span>
                                    </Card.Meta>
                                    <Card.Description>
                                        A PDF file that contains some content
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                            <Card onClick={() => this.handleOerClick(2)}>
                                <Image
                                    src='https://react.semantic-ui.com/images/avatar/large/matthew.png'
                                    wrapped
                                    ui={false}
                                />
                                <Card.Content>
                                    <Card.Header>OER file</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>
                                            Create on July 12, 2019
                                        </span>
                                    </Card.Meta>
                                    <Card.Description>
                                        A PDF file that contains some content
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                            <Card onClick={() => this.handleOerClick(3)}>
                                <Image
                                    src='https://react.semantic-ui.com/images/avatar/large/matthew.png'
                                    wrapped
                                    ui={false}
                                />
                                <Card.Content>
                                    <Card.Header>OER file</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>
                                            Create on July 12, 2019
                                        </span>
                                    </Card.Meta>
                                    <Card.Description>
                                        A PDF file that contains some content
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        </Card.Group>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button
                            id='cancelAttachOer'
                            color='red'
                            tabIndex='0'
                            type='button'
                            aria-label='Cancel'
                            data-tooltip='Cancel'
                            onClick={this.handleClose}
                        >
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </FocusTrap>
        );
    }
}

AttachOerModal.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default AttachOerModal;
