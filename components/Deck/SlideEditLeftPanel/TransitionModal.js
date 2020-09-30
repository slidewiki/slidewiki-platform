import { Button, Divider, Dropdown, Icon, Input, Modal, Popup, Segment } from 'semantic-ui-react';
import {connectToStores} from 'fluxible-addons-react';
import FocusTrap from 'focus-trap-react';
import {FormattedMessage, defineMessages} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import SlideEditStore from '../../../stores/SlideEditStore';
import changeSlideTransition from '../../../actions/slide/changeSlideTransition';



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
            fadeTransitionMessage: {
                id: 'transitionModal.fadeMessage',
                defaultMessage: 'Fade'
            },
            slideTransitionMessage: {
                id: 'transitionModal.slideMessage',
                defaultMessage: 'Slide'
            },
            zoomTransitionMessage: {
                id: 'transitionModal.zoomMessage',
                defaultMessage: 'Zoom'
            },
            concaveTransitionMessage: {
                id: 'transitionModal.concaveMessage',
                defaultMessage: 'Concave'
            },
            /////////////
            question: {
                id: 'transitionModal.question',
                defaultMessage: 'You are able to add this transition to the full presentation or only to this slide. What do you prefer?'
            },
            cancel: {
                id: 'transitionModal.cancel',
                defaultMessage: 'Cancel'
            },
            applyFull: {
                id: 'transitionModal.applyFull',
                defaultMessage: 'Apply to the full presentation'
            },
            onlySlide: {
                id: 'transitionModal.onlySlide',
                defaultMessage: 'Apply only to  this slide'
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

    handleTransitionType(type) {
        this.context.executeAction(changeSlideTransition, {
            slideTransition: this.props.transition,
            transitionType: type
        });
        this.handleClose();
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
            case 'fade':
                transitionName = this.context.intl.formatMessage(this.messages.fadeTransitionMessage);
                imgSrc = '/assets/images/slidetransitions/fade.gif';
                alt = 'Fade slide transition';
                break;
            case 'slide':
                transitionName = this.context.intl.formatMessage(this.messages.slideTransitionMessage);
                imgSrc = '/assets/images/slidetransitions/slide.gif';
                alt = 'Slide slide transition';
                break;
            case 'zoom':
                transitionName = this.context.intl.formatMessage(this.messages.zoomTransitionMessage);
                imgSrc = '/assets/images/slidetransitions/zoom.gif';
                alt = 'Zoom slide transition';
                break;
            case 'concave':
                transitionName = this.context.intl.formatMessage(this.messages.concaveTransitionMessage);
                imgSrc = '/assets/images/slidetransitions/concave.gif';
                alt = 'concave slide transition';
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
                    <Modal.Actions>
                        <button onClick={this.handleClose} className='ui cancel button'>
                            <i className='remove icon'/>
                            {this.context.intl.formatMessage(this.messages.cancel)}
                        </button>
                        <Button ref='applyFull' color='blue' tabIndex="0" type="button" className='ui blue button'
                                aria-label={this.context.intl.formatMessage(this.messages.applyFull)} labelPosition='left'
                                content={this.context.intl.formatMessage(this.messages.applyFull)}
                                icon='check'
                                onClick={this.handleTransitionType.bind(this, 'full')}
                        />
                        <Button ref='onlySlide' color="blue" tabIndex="0" type="button" className='ui blue button'
                                aria-label={this.context.intl.formatMessage(this.messages.onlySlide)} labelPosition='left'
                                content={this.context.intl.formatMessage(this.messages.onlySlide)}
                                icon='check'
                                onClick={this.handleTransitionType.bind(this, 'slide')}
                        />
                    </Modal.Actions>
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
