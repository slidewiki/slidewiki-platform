import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import FocusTrap from 'focus-trap-react';
import { Button, Divider, Dropdown, Icon, Input, Modal, Popup, Segment } from 'semantic-ui-react';
import {defineMessages} from 'react-intl';

class SlideCurrentlyEditedWarningModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            activeTrap: false,
        };

        //
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);


        // Messages
        this.messages = defineMessages({
            modalTitle: {
                id: 'SCEWModal.title',
                defaultMessage: 'Warning! Simultaneous Edition'
            },
            modalWarning: {
                id: 'SCEWModal.warning',
                defaultMessage: 'This version of this slide is also currently being edited by other users. The changes ' +
                    'you are performing could be overwritten by them. Contact them to avoid troubles with this slide. ' +
                    'The users editing this slide are: '
            }
        });
    }


    componentDidMount() {
        this.handleOpen();
    }

    handleOpen(){
        $('#app').attr('aria-hidden', 'true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });
    }

    handleClose(){
        $('#app').attr('aria-hidden', 'false');
        this.setState({
            modalOpen: false,
            activeTrap: false,
        });
    }

    unmountTrap() {
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    handleKeyPress = (event, param) => {
        if(event.key === 'Enter'){
            if(param === 'handleOpen') {
                this.handleOpen();
            }
        }
    };

    render () {

        const headerStyle = {
            'textAlign': 'center'
        };

        let triggerStyle = {
            /*display: none;
            visibility: hidden;*/
        };

        return (
            <Modal
                trigger={
                    <a style={triggerStyle} id="slideCurrentlyEditedWarningTrigger" role="button" onClick={this.handleOpen} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleOpen')}/>
                }
                open={this.state.modalOpen}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                id="slideCurrentlyEditedWarningModal"
                aria-labelledby="slideCurrentlyEditedWarningModalHeader"
                aria-describedby="slideCurrentlyEditedWarningModalDescription"
                tabIndex="0"
            >
                <FocusTrap
                    id="focus-trap-SCEWModal"
                    // className = "header"
                    active={this.state.activeTrap}
                    focusTrapOptions={{
                        onDeactivate:this.unmountTrap,
                        clickOutsideDeactivates:true,
                        initialFocus: '#slideCurrentlyEditedWarningModalDescription'
                    }}
                >
                    <Modal.Header className="ui center aligned" id="slideCurrentlyEditedWarningModalHeader">
                        <h1 style={headerStyle}>{this.context.intl.formatMessage(this.messages.modalTitle)}</h1>
                    </Modal.Header>
                    <Modal.Content>
                        <div id="slideCurrentlyEditedWarningModalDescription" tabIndex="0">{this.context.intl.formatMessage(this.messages.modalWarning)}</div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button type="button" color="blue" onClick={this.handleClose} className="ui button">
                            <i className="remove icon"/>
                            {this.context.intl.formatMessage(this.messages.cancel)}
                        </Button>
                    </Modal.Actions>

                </FocusTrap>
            </Modal>
        );
    }

}

SlideCurrentlyEditedWarningModal.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    getUser: PropTypes.func
};

export default SlideCurrentlyEditedWarningModal;
