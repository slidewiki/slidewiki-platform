import React from 'react';
import FocusTrap from 'focus-trap-react';
import {Button, Container, Form, Modal, Radio, Icon, Segment, Grid, TextArea} from 'semantic-ui-react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../../stores/ContentStore';
import UserProfileStore from '../../../../stores/UserProfileStore';


class EmbedModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeTrap: false,
        };

        this.handleEmbed = this.handleEmbed.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);

        this.messages = defineMessages({
            embedModal_header:{
                id:'embedModal.embedModal_embedHeader',
                defaultMessage: 'Embed deck'
            },
            embedModal_embedButton:{
                id:'embedModal.embedModal_embedButton',
                defaultMessage: 'Embed'
            },
            embedModal_cancelButton:{
                id:'embedModal.embedModal_cancelButton',
                defaultMessage: 'Cancel'
            }
        });
    }

    handleEmbed() {
//       this.props.onClose.call();
//       this.state.modalOpen.call();

//       $('#app').attr('aria-hidden', 'true');
       this.setState({
           modalOpen:true,
           activeTrap:true
       });
       // TODO: implement.
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
            activeTrap: false
        });
    }

    unmountTrap() {
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    render() {
        return(
            <Modal
                    trigger={
                        <Button
                                icon="code"
                                color="grey"
                                type="button"
                                onClick={this.handleEmbed}
                                content={this.context.intl.formatMessage(this.messages.embedModal_embedButton)}
                        />
                    }
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    id="embedModal"
                    aria-labelledby="embedModalHeader"
                    aria-describedby="embedModalDescription"
                    aria-hidden = {!this.state.modalOpen}
                    role="dialog"
                    tabIndex="0">
                <FocusTrap
                        id="focus-trap-embedModal"
                        className = "header"
                        active={this.state.activeTrap}
                        focusTrapOptions={{
                            onDeactivate: this.unmountTrap,
                            clickOutsideDeactivates: true ,
                            initialFocus: '#embedModalDescription'
                        }}
                >
                    <Modal.Header className="ui center aligned" id="embedModalHeader">
                        <h1 style={{'textAlign': 'center'}}> {this.context.intl.formatMessage(this.messages.embedModal_header)}</h1>
                    </Modal.Header>
                    <Modal.Content>
                        <Container>
                            <Segment color="blue" textAlign="center" padded>
                                <Segment>
                                    <Form.Field >
                                        <TextArea id="embedModalDescription"
                                                label="Test" value="Hello there, this is some text in a text area."/>
                                    </Form.Field>
                                    <Button
                                            icon="remove"
                                            color="red"
                                            type="button"
                                            onClick={this.handleClose}
                                            content={this.context.intl.formatMessage(this.messages.embedModal_cancelButton)}
                                    />
                                </Segment>
                            </Segment>
                        </Container>
                    </Modal.Content>
                </FocusTrap>
            </Modal>
        );
    }

}

EmbedModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

EmbedModal = connectToStores(EmbedModal,[ContentStore, UserProfileStore], (context, props) => {
    return{
        ContentStore : context.getStore(ContentStore).getState(),
        UserProfileStore : context.getStore(UserProfileStore).getState()
    };
});

export default EmbedModal;
