import React from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';

const headerStyle = {
    'textAlign': 'center'
};
const modalStyle = {
    top: '15%'
};

class AttachSubdeckModal extends React.Component{

    constructor(props) {
        super(props);
        this.state = {modalOpen:false};
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);



    }

    handleOpen(){
        this.setState({
            modalOpen: true,
        });

    }

    handleClose(){
        this.setState({
            modalOpen: false,
        });

    }
    render() {
        return (
            <Modal trigger={
                    <Button as="button" className={this.props.buttonStyle.classNames}
                      type="button" aria-label="Attach Slide" data-tooltip="Attach Slide"
                      icon basic attached="left" open={this.state.modalOpen} onClick={this.handleOpen}>
                        <Icon.Group size="large">
                            <Icon className="yellow" name="folder" />
                            <Icon className="corner" name="attach" />
                        </Icon.Group>
                    </Button>
                   }
                open={this.modalOpen}
                onClose={this.handleClose}
                size="large" >

                <Modal.Header as="h1">
                     Attach Deck
                </Modal.Header>
                <Modal.Content>
                 tab panel
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={this.handleClose} inverted>
                    <Icon name='checkmark' /> Got it
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

}

AttachSubdeckModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default AttachSubdeckModal;
