import React from 'react';
import FocusTrap from 'focus-trap-react';
import {Button, Container, Form, Modal, Icon, Segment, Grid, TextArea, Input, Label} from 'semantic-ui-react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../../stores/ContentStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import DeckViewStore from '../../../../stores/DeckViewStore';
import SlideViewStore from '../../../../stores/SlideViewStore';
import ContributorsStore from '../../../../stores/ContributorsStore';


class EmbedModal extends React.Component {
    constructor(props) {
        super(props);

        this.defaultWidthValue = 800;
        this.defaultHeightValue = 400;

        this.state = {
            modalOpen: false,
            activeTrap: false,
            exportObject: 'd',
            size: 'sm',
            width: this.defaultWidthValue,
            height: this.defaultHeightValue,
            href: null
        };

        this.handleEmbed = this.handleEmbed.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleEmbedChange = this.handleEmbedChange.bind(this);
        this.getHref = this.getHref.bind(this);

        this.messages = defineMessages({
            closeButton:{
                id:'embedModal.closeButton',
                defaultMessage: 'Close'
            },
            deckRadio:{
                id:'embedModal.deckRadio',
                defaultMessage: 'Deck'
            },
            slideshowRadio:{
                id:'embedModal.slideshowRadio',
                defaultMessage: 'Slideshow'
            },
            slideRadio:{
                id:'embedModal.slideRadio',
                defaultMessage: 'Slide'
            },
            small:{
                id:'embedModal.small',
                defaultMessage: 'Small'
            },
            medium:{
                id:'embedModal.medium',
                defaultMessage: 'Medium'
            },
            large:{
                id:'embedModal.large',
                defaultMessage: 'Large'
            },
            other:{
                id:'embedModal.other',
                defaultMessage: 'Other'
            },
        });
    }

    handleEmbed() {
        this.setState({
            modalOpen:true,
            activeTrap:true
        });
    }

    handleEmbedChange(e, sender) {
        this.setState({exportObject: sender.value, href: this.getHref(sender.value)});
    }

    getHref(exportObject) {
        if (exportObject === undefined) {
            exportObject = this.state.exportObject;
        }
        switch (exportObject) {
            case 'd':
                const href = window.location.href;
                if (this.props.ContentStore.selector.stype === 'slide') {
                    return href.substring(0, href.indexOf('/slide/') + 1);
                } else {
                    return href;
                }
            case 'ss':
                return window.location.protocol + '//' + window.location.host + this.props.embedPresentationHref;
            case 's':
                return window.location.href;
        }
        return null;
    }

    handleChange(e, sender) {
        if (sender.type === 'radio') {
            switch (sender.value) {
                case 'sm':
                    this.widthInput.inputRef.value = '400';
                    this.heightInput.inputRef.value = '200';
                    break;
                case 'md':
                    this.widthInput.inputRef.value = '800';
                    this.heightInput.inputRef.value = '400';
                    break;
                case 'lg':
                    this.widthInput.inputRef.value = '1000';
                    this.heightInput.inputRef.value = '600';
                    break;
            }
            this.setState({
                size: sender.value,
                width: this.widthInput && this.widthInput.inputRef.value || this.defaultWidthValue,
                height: this.heightInput && this.heightInput.inputRef.value || this.defaultHeightValue,
                href: this.getHref()
            });
        } else {
            this.setState({
                width: this.widthInput && this.widthInput.inputRef.value || this.defaultWidthValue,
                height: this.heightInput && this.heightInput.inputRef.value || this.defaultHeightValue,
                href: this.getHref()
            });
        }
    }

    handleClose() {
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

    findCurrentRevision(deckData) {
        if (deckData.revisions) {
            return deckData.revisions.length === 1 ? deckData.revisions[0] : deckData.revisions.find((rev) => {
                return rev.id === deckData.active;
            });
        } else {
            return null;
        }
    }

    findTitle() {
        if (this.props.ContentStore.selector.stype === 'slide') {
            return this.props.SlideViewStore.title;
        } else {
            return this.props.DeckViewStore.deckData.title;
        }
    }

    render() {
        const {size, exportObject} = this.state;
        const title = this.findTitle();
        const userName = ((this.props.ContentStore.selector.stype === 'slide')
                ? this.props.ContributorsStore.creator[0].username : this.props.DeckViewStore.creatorData.username);
        const slideRadio = (this.props.ContentStore.selector.stype === 'slide')
                ? <Form.Radio label={this.context.intl.formatMessage(this.messages.slideRadio)}
                        value='s' checked={exportObject === 's'} onChange={this.handleEmbedChange}/> : null;
        return(
            <Modal
                    trigger={
                        <div className="item" data-value="Embed" role="menuitem" aria-label="Embed" data-tooltip="Embed" tabIndex="0" onClick={this.handleEmbed.bind(this)}>
                            <div role="button" tabIndex="0" className="SocialMediaShareButton Demo__some-network__share-button">
                                <div style={{width: this.props.size + 'px', height: this.props.size + 'px'}}>
                                    {/*<i className="code icon" style={{*/}
                                        {/*width: this.props.size + 'px',*/}
                                        {/*height: this.props.size + 'px',*/}
                                        {/*fontSize: this.props.fontSize + 'px !important',*/}
                                        {/*paddingTop: (this.props.size - 3) / 2 + 'px',*/}
                                        {/*borderRadius: this.props.size / 2 + 'px',*/}
                                        {/*backgroundColor: this.props.backgroundColor,*/}
                                        {/*color: this.props.color*/}
                                    {/*}}></i>*/}
                                    <svg className="code-icon" viewBox="0 0 64 64" width={33} height={33}>
                                        <g>
                                            <circle cx={32} cy={32} r={31} fill={this.props.backgroundColor}/>
                                        </g>
                                        <g transform="translate(9.1 11.5) scale(0.08 0.08)">
                                            <path fill="white"
                                                  d="M234.8 511.7L196 500.4c-4.2-1.2-6.7-5.7-5.5-9.9L331.3 5.8c1.2-4.2 5.7-6.7 9.9-5.5L380 11.6c4.2 1.2 6.7 5.7 5.5 9.9L244.7 506.2c-1.2 4.3-5.6 6.7-9.9 5.5zm-83.2-121.1l27.2-29c3.1-3.3 2.8-8.5-.5-11.5L72.2 256l106.1-94.1c3.4-3 3.6-8.2.5-11.5l-27.2-29c-3-3.2-8.1-3.4-11.3-.4L2.5 250.2c-3.4 3.2-3.4 8.5 0 11.7L140.3 391c3.2 3 8.2 2.8 11.3-.4zm284.1.4l137.7-129.1c3.4-3.2 3.4-8.5 0-11.7L435.7 121c-3.2-3-8.3-2.9-11.3.4l-27.2 29c-3.1 3.3-2.8 8.5.5 11.5L503.8 256l-106.1 94.1c-3.4 3-3.6 8.2-.5 11.5l27.2 29c3.1 3.2 8.1 3.4 11.3.4z"
                                                  className=""></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    }
                    open={this.state.modalOpen}
                    onOpen={this.handleChange}
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
                            initialFocus: '#deckRadio'
                        }}>
                    <Modal.Header className="ui center aligned" id="embedModalHeader">
                        <h1 style={{'textAlign': 'left'}}>
                            <FormattedMessage id='embedModal.embedHeader'
                                values={{
                                    title: title,
                                    creator: userName
                                }}
                                defaultMessage={'Embed SlideWiki deck "{title}"'}
                            />
                        </h1>
                    </Modal.Header>
                    <Modal.Content>
                        <Container>
                            <FormattedMessage id='embedModal.description'
                                    defaultMessage='Use the options to select how this deck will be displayed. Then copy the generated code into your site.'/>
                            <Segment color="blue" textAlign="center" padded>
                                <Segment>
                                    <Form>
                                        <Form.Field>
                                            <textarea aria-label="Embed content code"
                                                    ref="embedModalText"
                                                    label="description"
                                                    height="100px"
                                                    value={
                                                        '<iframe src="' + this.state.href + '" width="'
                                                        + this.state.width + '" height="' + this.state.height
                                                        + '"></iframe><p>'
                                                        + '<a href="' + this.state.href +'">'
                                                        + title
                                                        + ' - '
                                                        + userName
                                                        + '</a></p>'
                                                    }/>
                                        </Form.Field>
                                        <Form.Group inline>
                                            <label>
                                                <b><FormattedMessage id='embedModal.embed' defaultMessage='Embed: '/></b>
                                            </label>
                                            <Form.Radio autoFocus id='embedModalDeckRadio'
                                                    label={this.context.intl.formatMessage(this.messages.deckRadio)}
                                                    value='d' checked={exportObject === 'd'}
                                                    onChange={this.handleEmbedChange}/>
                                            <Form.Radio id='embedModalSlideshowRadio' label={this.context.intl.formatMessage(this.messages.slideshowRadio)}
                                                    value='ss' checked={exportObject === 'ss'}
                                                    onChange={this.handleEmbedChange}/>
                                            {slideRadio}
                                        </Form.Group>
                                        <Form.Group inline>
                                            <label>
                                                <b><FormattedMessage id='embedModal.size' defaultMessage='Size: '/></b>
                                            </label>
                                            <Form.Radio id="embedModalSmallRadio" label={this.context.intl.formatMessage(this.messages.small)}
                                                    value='sm' checked={size === 'sm'} onChange={this.handleChange}/>
                                            <Form.Radio id="embedModalMediumRadio" label={this.context.intl.formatMessage(this.messages.medium)}
                                                    value='md' checked={size === 'md'} onChange={this.handleChange}/>
                                            <Form.Radio id="embedModalLargeRadio" label={this.context.intl.formatMessage(this.messages.large)}
                                                    value='lg' checked={size === 'lg'} onChange={this.handleChange}/>
                                            <Form.Radio id="embedModalOtherRadio" label={this.context.intl.formatMessage(this.messages.other)}
                                                    value='ot' checked={size === 'ot'} onChange={this.handleChange}/>
                                            <Form.Field>
                                                <label htmlFor="embedModalWidth">
                                                    <FormattedMessage id='embedModal.widthLabel'
                                                            defaultMessage='Width of embedded content'/>
                                                </label>
                                                <Input id="embedModalWidth" ref={(ref) => this.widthInput = ref}
                                                        disabled={this.state.size !== 'ot'}
                                                        placeholder={this.defaultWidthValue}
                                                        onChange={this.handleChange}/>
                                            </Form.Field>
                                            <Form.Field>
                                                <label htmlFor="embedModalHeight">
                                                    <FormattedMessage id='embedModal.heightLabel'
                                                            defaultMessage='Height of embedded content'/>
                                                </label>
                                                <Input id="embedModalHeight" ref={(ref) => this.heightInput = ref}
                                                        disabled={this.state.size !== 'ot'}
                                                        placeholder={this.defaultHeightValue}
                                                        onChange={this.handleChange}/>
                                            </Form.Field>
                                        </Form.Group>
                                        <Modal.Actions>
                                            <Button icon="remove"
                                                    color="red"
                                                    type="button"
                                                    onClick={this.handleClose}
                                                    content={this.context.intl.formatMessage(this.messages.closeButton)}/>
                                        </Modal.Actions>
                                    </Form>
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

EmbedModal = connectToStores(EmbedModal, [ContentStore, UserProfileStore, DeckViewStore, SlideViewStore,
    ContributorsStore], (context, props) => {
        return {
            ContentStore: context.getStore(ContentStore).getState(),
            UserProfileStore: context.getStore(UserProfileStore).getState(),
            DeckViewStore: context.getStore(DeckViewStore).getState(),
            SlideViewStore: context.getStore(SlideViewStore).getState(),
            ContributorsStore: context.getStore(ContributorsStore).getState()
        };
    });

export default EmbedModal;
