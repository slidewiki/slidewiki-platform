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
            activeTrap: false
        };

        this.messages = defineMessages({
            noTransitionMessage: {
                id: 'transitionModal.noneMessage',
                defaultMessage: 'No slide transition'
            },
            convexTransitionMessage: {
                id: 'transitionModal.convexMessage',
                defaultMessage: 'Convex'
            }
        });
    }

    render() {
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
                transitionName = this.context.intl.formatMessage(this.messages.convexTransitionMessage)
                imgSrc = '/assets/images/slidetransitions/convex.gif'
                alt = 'Convex slide transition'
                break;

        }

        if (noTransition) {
            modalTrigger =
                <a className="item" role="button" onClick={this.handleSlideTransitionchange.bind(this, this.props.transition)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleSlideTransitionchange', this.props.transition)}>
                    <i tabIndex="0" className="eye slash outline icon"/><FormattedMessage id={'transitionModalTrigger.' + this.props.transition} defaultMessage={transitionName} />
                </a>;
        } else {
            modalTrigger =
                <a className="item" role="button" onClick={this.handleSlideTransitionchange.bind(this, this.props.transition)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleSlideTransitionchange', this.props.transition)}>
                    <i tabIndex="0" aria-label={alt}><FormattedMessage id={'transitionModalTrigger.' + this.props.transition} defaultMessage={transitionName} /></i>
                    <img aria-hidden="true" className="ui image small bordered fluid" src={imgSrc} alt={alt} />
                </a>;
        }
        
        return (
            <Modal
                trigger={modalTrigger}
                open={this.state.modalOpen}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                id="paintModal"
                aria-labelledby="paintModalHeader"
                aria-describedby="paintModalDescription"
                tabIndex="0"
            >
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
