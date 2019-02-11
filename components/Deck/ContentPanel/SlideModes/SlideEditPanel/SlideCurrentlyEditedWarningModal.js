import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import FocusTrap from 'focus-trap-react';
import { Button, Divider, Dropdown, Icon, Input, Modal, Popup, Segment } from 'semantic-ui-react';
import {defineMessages} from 'react-intl';
import SlideCurrentlyEditedStore from '../../../../../stores/SlideCurrentlyEditedStore';

class SlideCurrentlyEditedWarningModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            activeTrap: false,
        };

        this.usersEditing = [];

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
            },
            confirm: {
                id: 'SCEWModal.confirm',
                defaultMessage: 'Confirm'
            },
            users: {
                id: 'SCEWModal.users',
                defaultMessage: 'Users'
            },
            editingSince: {
                id: 'SCEWModal.editingSince',
                defaultMessage: 'Editing since'
            },
            note: {
                id: 'SCEWModal.note',
                defaultMessage: 'Note: we recommend you to cancel the edition of this slide to not overwrite the changes ' +
                    'performed by your colleagues. If they confirm you that they are not editing this slide anymore you can ' +
                    'continue editing it.'
            }
        });
    }

/*

    componentDidMount() {
        this.handleOpen();
    }
*/

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
            usersEditing: []
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


    componentWillReceiveProps(nextProps) {

        let usersEditing = nextProps.SlideCurrentlyEditedStore.usersCurrentlyEditing ? nextProps.SlideCurrentlyEditedStore.usersCurrentlyEditing.slice() : [];

        this.usersEditing = usersEditing;

        if ( usersEditing.length > 0 ) {
            this.handleOpen();
        }

    };
    render () {

        const headerStyle = {
            'textAlign': 'center'
        };

        const modalContentStyle = {
            height: '25%'
        };

        const triggerStyle = {
            display: none;
            visibility: hidden;
        };

        let usersList = this.usersEditing.map((userEditing) => {
            return <tr>
                    <th>{userEditing.user}</th>
                    <th>{userEditing.timestamp}</th>
                   </tr>;
        });

        usersList.join();

        return (

            <Modal
                trigger={
                    <div style={triggerStyle} id="slideCurrentlyEditedWarningTrigger" role="button" onClick={this.handleOpen} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleOpen')}>hola k aseeee</div>
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
                        <div id="slideCurrentlyEditedWarningModalDescription" tabIndex="0" style={modalContentStyle}>{this.context.intl.formatMessage(this.messages.modalWarning)}</div>
                        <br/>
                        <table>
                            <tr>
                                <th>{this.context.intl.formatMessage(this.messages.users)}</th>
                                <th>{this.context.intl.formatMessage(this.messages.editingSince)}</th>
                            </tr>
                            {usersList}
                        </table>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button type="button" color="blue" onClick={this.handleClose} className="ui button">
                            <i className="remove icon"/>
                            {this.context.intl.formatMessage(this.messages.confirm)}
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

SlideCurrentlyEditedWarningModal = connectToStores(SlideCurrentlyEditedWarningModal, [SlideCurrentlyEditedStore], (context, props) => {
    return {
        SlideCurrentlyEditedStore: context.getStore(SlideCurrentlyEditedStore).getState()
    };
});

export default SlideCurrentlyEditedWarningModal;
