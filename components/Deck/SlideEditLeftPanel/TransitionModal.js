import { Button, Divider, Dropdown, Icon, Input, Modal, Popup, Segment } from 'semantic-ui-react';
import {connectToStores} from 'fluxible-addons-react';
import FocusTrap from 'focus-trap-react';
import {FormattedMessage, defineMessages} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import SlideEditStore from '../../../stores/SlideEditStore';



class TransitionModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeTrap: false,
            transition: null
        };

        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.messages = defineMessages({
            noTransitionMessage: {
                id: 'transitionModal.noneMessage',
                defaultMessage: 'No slide transition'
            },
            convexTransitionMessage: {
                id: 'transitionModal.convexMessage',
                defaultMessage: 'Convex'
            },
            /////////////
            question: {
                id: 'transitionModal.question',
                defaultMessage: 'You are able to add this transition to the full presentation or only for this slide. What do you prefer?'
            }

        });
    }

    unmountTrap() {
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    handleOpen(){
        $('#app').attr('aria-hidden', 'true');
        this.setState({
            modalOpen:true,
            activeTrap:true,
            transition: this.props.transition
        });
    }

    handleClose() {
        $('#app').attr('aria-hidden', 'false');
        this.setState({
            modalOpen: false,
            activeTrap: false
        });
    }

    render() {
        const headerStyle = {
            'textAlign': 'center'
        };
        let transitionName = '';
        let modalTrigger = '';
        let noTransition = false;
        let imgSrc = '';
        let alt = '';
        switch (this.props.transition) {
            case 'none':
                transitionName = this.context.intl.formatMessage(this.messages.noTransitionMessage);
                noTransition = true;
                break;
            case 'convex':
                transitionName = this.context.intl.formatMessage(this.messages.convexTransitionMessage);
                imgSrc = '/assets/images/slidetransitions/convex.gif';
                alt = 'Convex slide transition';
                break;

        }

        if (noTransition) {
            modalTrigger =
                <a className="item" role="button" onClick={this.handleOpen} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleSlideTransitionchange', this.props.transition)}>
                    <i tabIndex="0" className="eye slash outline icon"/>{transitionName}
                </a>;
        } else {
            modalTrigger =
                <a className="item" role="button" onClick={this.handleOpen} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleSlideTransitionchange', this.props.transition)}>
                    <i tabIndex="0" aria-label={alt}/>{transitionName}
                    <img aria-hidden="true" className="ui image small bordered fluid" src={imgSrc} alt={alt}/>
                </a>;
        }


        let focusTrapOptions = {
            onDeactivate:this.unmountTrap,
            clickOutsideDeactivates:true,
            initialFocus: '#transitionModal' + this.props.transition + 'Description'
        };
        return (
            <Modal
                trigger={modalTrigger}
                open={this.state.modalOpen}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                id={'transitionModal.' + this.props.transition}
                aria-labelledby={'transitionModal.' + this.props.transition + 'Header'}
                aria-describedby={'transitionModal.' + this.props.transition + 'Description'}
                tabIndex="0"
            >
                <FocusTrap
                    id={'focus-trap-transitionModal-' + this.props.transition}
                    className = 'header'
                    active={this.state.activeTrap}
                    focusTrapOptions={focusTrapOptions}
                >
                    <Modal.Header className="ui center aligned" id="paintModalHeader">
                        <h1 style={headerStyle}>Select the way you want to add the transition</h1>
                    </Modal.Header>
                    <Modal.Content>
                        <Divider/>
                            <div id={'transitionModal' + this.props.transition + 'Description'}>
                                {this.context.intl.formatMessage(this.messages.question)}
                            </div>

                        <Divider/>
                    </Modal.Content>
                </FocusTrap>
            </Modal>
        );
    }

}

TransitionModal.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

connectToStores(TransitionModal, [SlideEditStore], (context, props) => {
    return {
        SlideEditStore: context.getStore(SlideEditStore).getState()
    };
});

export default TransitionModal;
