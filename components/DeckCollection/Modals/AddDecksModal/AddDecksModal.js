import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { navigateAction } from 'fluxible-router';
import { Button, Icon, Modal, Header, Image, Segment, TextArea, Menu, Popup, Container } from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { fetchUserDecks } from '../../../../actions/user/userprofile/fetchUserDecks';
import { fetchNextUserDecks } from '../../../../actions/user/userprofile/fetchNextUserDecks';
import DeckCollectionStore from '../../../../stores/DeckCollectionStore';
import DecksList from './DecksList';
import SearchForm from '../../../Deck/ContentPanel/AttachSubdeck/AttachSearchForm';
import loadRecentDecks from '../../../../actions/attachSubdeck/loadRecentDecks';
import loadMoreSearchResults from '../../../../actions/search/loadMoreResults';
import updateModalSubtitle from '../../../../actions/collections/updateModalSubtitle';

class AddDecksModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'myDecksTab',
            isOpen: false,
            selectedDecks: this.props.selectedDecks.slice(), 
        };

        this.messages = this.getIntlMessages();
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }
    componentWillReceiveProps(newProps){
        if (this.props !== newProps) {
            this.setState({
                selectedDecks: newProps.selectedDecks.slice(),
            });
        }
    }
    handleMenuClick({ id }){
        if (id === 'slidewikiTab') {
            this.context.executeAction(loadRecentDecks, {
                offset: 0, 
                limit: 20,
            });
            this.context.executeAction(updateModalSubtitle, 'Recent decks');

        } else if (id === 'myDecksTab') {
            this.context.executeAction(fetchUserDecks, { params: {} });
            this.context.executeAction(updateModalSubtitle, '');
        }

        this.setState({ 
            activeItem: id, 
        });
    }
    handleOpen(){
        this.context.executeAction(updateModalSubtitle, '');
        this.context.executeAction(fetchUserDecks, { params: {} });

        this.setState({
            isOpen: true,
        });
    }
    handleClose(){
        this.setState({
            isOpen: false,
            activeItem: 'myDecksTab',
        });
    }
    handleSave() {
        this.props.handleAdd(this.state.selectedDecks);
        this.handleClose();
    }
    getIntlMessages(){
        return defineMessages({
            modalTitle: {
                id: 'AddDecksToCollectionModal.title',
                defaultMessage: 'Add decks to playlist'
            }, 
            fromMyDecksTitle: {
                id: 'AddDecksToCollectionModal.fromMyDecks',
                defaultMessage: 'From My Decks'
            }, 
            fromSlidewikiTitle: {
                id: 'AddDecksToCollectionModal.fromSlidewiki',
                defaultMessage: 'From Slidewiki'                
            },
            buttonAdd: {
                id: 'AddDecksToCollectionModal.button.add',
                defaultMessage: 'Add'
            }, 
            buttonClose: {
                id: 'AddDecksToCollectionModal.button.close',
                defaultMessage: 'Close'
            }, 

        });
    }
    handleOnDeckClick(deck){
        let newState = Object.assign({}, this.state);

        let index = this.state.selectedDecks.findIndex( (d) => d.deckID === deck.deckID);
        if (index < 0) {

            // add selected deck
            newState.selectedDecks.push(deck);
        } else {

            // if already selected, then remove it
            newState.selectedDecks.splice(index, 1);
        }

        this.setState(newState);
    }
    loadMore(nextLink){
        if (this.state.activeItem === 'myDecksTab') {
            this.context.executeAction(fetchNextUserDecks, {
                nextLink: nextLink
            });
        } else if (this.state.activeItem === 'slidewikiTab') {
            this.context.executeAction(loadMoreSearchResults, {
                queryparams: nextLink
            });
        }
    }
    getDeckListStyle(){
        return {
            maxHeight: (this.state.activeItem === 'myDecksTab') ? '640px' : '320px', 
            minHeight: '320px', 
            overflowY: 'auto',
        };
    }
    render() {
        let button = <Button floated="right" size="small" primary positive as="button"
            type="button"
            aria-label={this.context.intl.formatMessage(this.messages.modalTitle)}
            aria-hidden={this.state.isOpen}
            onClick={this.handleOpen}
            tabIndex={ this.state.isOpen ? -1 : 0} >
            {this.context.intl.formatMessage(this.messages.modalTitle)}
        </Button>;

        let decks = this.props.DeckCollectionStore.decks;
        let decksMeta = this.props.DeckCollectionStore.decksMeta;

        return (
            <Modal 
                trigger={button}
                id="newCollectioModal"
                dimmer='blurring' 
                size='small' 
                role='dialog' 
                aria-labelledby='addNewCollectionHeader'
                aria-describedby='addNewCollectionDescription'
                aria-hidden = {!this.state.isOpen}
                tabIndex="0"
                open={this.state.isOpen}
                onClose={this.handleClose}>

                <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.state.isOpen} className="header">
                    <Modal.Header className="ui center aligned" as="h1" id='addNewCollectionHeader'>
                        {this.context.intl.formatMessage(this.messages.modalTitle)}
                    </Modal.Header>
                    <Modal.Content>
                            <TextArea className="sr-only" id="addNewCollectionDescription" value="Create a new deck collection" tabIndex ='-1'/>
                            <Menu attached='top' tabular role="tablist">
                               <Menu.Item name={this.context.intl.formatMessage(this.messages.fromMyDecksTitle)} id="myDecksTab" active={this.state.activeItem === 'myDecksTab'} aria-selected={this.state.activeItem === 'myDecksTab'} onClick={this.handleMenuClick.bind(this, {id: 'myDecksTab'})} onKeyPress={this.handleMenuClick.bind(this, {id: 'myDecksTab'})} role="tab" tabIndex="0" />
                               <Menu.Item name={this.context.intl.formatMessage(this.messages.fromSlidewikiTitle)} id="slidewikiTab" active={this.state.activeItem === 'slidewikiTab'} aria-selected={this.state.activeItem === 'slidewikiTab'} onClick={this.handleMenuClick.bind(this, {id: 'slidewikiTab'})} onKeyPress={this.handleMenuClick.bind(this, {id: 'slidewikiTab'})} role="tab" tabIndex="0" />
                            </Menu>
                            <Segment attached='bottom' basic>
                                { (this.state.activeItem === 'slidewikiTab') && 
                                    <SearchForm />
                                }
                                <Header as='h3'>{ this.props.DeckCollectionStore.subheader }</Header>
                                <DecksList style={this.getDeckListStyle()} handleOnDeckClick={this.handleOnDeckClick.bind(this)} loggedInDisplayName={this.props.loggedInDisplayName} loading={!decks} decks={decks} selectedDecks={this.state.selectedDecks} meta={decksMeta} loadMore={this.loadMore.bind(this)} loadMoreLoading={this.props.DeckCollectionStore.loadMoreLoading} loadMoreError={this.props.DeckCollectionStore.loadMoreError} />
                            </Segment>
                            <Modal.Actions>
                                <Segment basic textAlign="center">
                                    <div>
                                        <Button id="addDecksButton" primary as='button' onClick={this.handleSave}><Icon name='plus'/><FormattedMessage {...this.messages.buttonAdd} /></Button>
                                        <Button as='button' onClick={this.handleClose}><Icon name='close'/><FormattedMessage {...this.messages.buttonClose} /></Button>
                                    </div>
                                </Segment>
                            </Modal.Actions>
                    </Modal.Content>     
                </FocusTrap>
            </Modal>
        );
    }
}

AddDecksModal.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

AddDecksModal = connectToStores(AddDecksModal, [DeckCollectionStore], (context, props) => {
    return {
        DeckCollectionStore: context.getStore(DeckCollectionStore).getState(),
    };
});

export default AddDecksModal;