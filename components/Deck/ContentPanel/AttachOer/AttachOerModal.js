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

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
    }

    componentWillReceiveProps(nextProps) {}

    componentWillUnmount() {}

    handleOpen() {
        $('#app').attr('aria-hidden', 'true');
        this.setState({
            modalOpen: true,
            activeTrap: true
        });
    }

    handleClose() {
        //console.log('handleClose');
        $('#app').attr('aria-hidden', 'false');
        this.setState({
            modalOpen: false,
            activeTrap: false,
            selectedQuestions: [],
            //showQuestions:true,
            selectedDeckId: -1
        });
    }

    // Needed for accessibility (keep the focus inside the modal)
    unmountTrap() {
        if (this.state.activeTrap) {
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden', 'false');
        }
    }

    // This functions handles the clicked OER resource, the resource
    // id can be passed to find out what resources has been selected
    handleOerClick = (resourceId) => {
        console.log('Selected resource', resourceId);
        this.handleClose();
        this.context.executeAction(insertOerContent, {
            oerContent:
                '<a href="http://google.com" target="_blank">Test oer link</a>'
        });
    };

    render() {
        let attachQuestionsBtn = (
            <a
                className="item"
                id="handleAddQuestionsModal"
                role="button"
                aria-hidden={this.state.modalOpen}
                onClick={this.handleOpen}
                onKeyPress={(evt) =>
                    this.handleKeyPress(evt, 'handleAddQuestionsClick')
                }
                tabIndex={this.props.buttonStyle.noTabIndex ? -1 : 0}
            >
                <i className="content icon" /> Add OER
            </a>
        );

        return (
            <FocusTrap
                id="focus-trap-attach-oer"
                focusTrapOptions={{
                    onDeactivate: this.unmountTrap,
                    clickOutsideDeactivates: true,
                    initialFocus: '#cancelAttachOer'
                }}
                active={this.state.activeTrap}
            >
                <Modal
                    trigger={attachQuestionsBtn}
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    role="dialog"
                    id="attachOerModal"
                    aria-labelledby="attachOerHeader"
                    aria-hidden={!this.state.modalOpen}
                    tabIndex="0"
                    //size="large"
                >
                    <Modal.Header as="h1" id="attachOerHeader">
                        Select Open Educational Resources
                    </Modal.Header>

                    <Modal.Content>
                        <Card.Group>
                            <Card onClick={() => this.handleOerClick(1)}>
                                <Image
                                    src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                                    wrapped
                                    ui={false}
                                />
                                <Card.Content>
                                    <Card.Header>OER file</Card.Header>
                                    <Card.Meta>
                                        <span className="date">
                                            Create on July 12, 2019
                                        </span>
                                    </Card.Meta>
                                    <Card.Description>
                                        A PDF file that contains some content
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                            <Card onClick={() => this.handleOerClick(1)}>
                                <Image
                                    src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                                    wrapped
                                    ui={false}
                                />
                                <Card.Content>
                                    <Card.Header>OER file</Card.Header>
                                    <Card.Meta>
                                        <span className="date">
                                            Create on July 12, 2019
                                        </span>
                                    </Card.Meta>
                                    <Card.Description>
                                        A PDF file that contains some content
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                            <Card onClick={() => this.handleOerClick(1)}>
                                <Image
                                    src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                                    wrapped
                                    ui={false}
                                />
                                <Card.Content>
                                    <Card.Header>OER file</Card.Header>
                                    <Card.Meta>
                                        <span className="date">
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
                            id="cancelAttachOer"
                            color="red"
                            tabIndex="0"
                            type="button"
                            aria-label="Cancel"
                            data-tooltip="Cancel"
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

AttachOerModal = connectToStores(
    AttachOerModal,
    [UserProfileStore, DeckTreeStore],
    (context, props) => {
        return {
            UserProfileStore: context.getStore(UserProfileStore).getState(),
            DeckTreeStore: context.getStore(DeckTreeStore).getState()
        };
    }
);

export default AttachOerModal;
