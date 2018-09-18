import PropTypes from 'prop-types';
import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import DeckCollectionStore from '../../../stores/DeckCollectionStore';
import UserProfileStore from '../../../stores/UserProfileStore';
import UserFollowingsStore from '../../../stores/UserFollowingsStore';
import { connectToStores } from 'fluxible-addons-react';
import CustomDate from '../../Deck/util/CustomDate';
import CollectionDecks from './CollectionDecks';
import CollectionDecksReorder from './CollectionDecksReorder';
import {Button, Icon} from 'semantic-ui-react';
import updateCollectionDeckOrder from '../../../actions/collections/updateCollectionDeckOrder';
import createFollowing from '../../../actions/following/createFollowing';
import deleteFollowing from '../../../actions/following/deleteFollowing';
import {FormattedMessage, defineMessages} from 'react-intl';
import AddDecksModal from '../Modals/AddDecksModal/AddDecksModal';

class CollectionPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            editMode: false, 
            decksOrder: this.props.DeckCollectionStore.collectionDetails.decks.slice() || [], 
        };

        this.messages = this.getIntlMessages();
    }
    componentDidMount() {
        $(this.refs.sortDropdown).dropdown({onChange: this.dropdownSelect.bind(this)});
    }

    componentDidUpdate() {
        $(this.refs.sortDropdown).dropdown({onChange: this.dropdownSelect.bind(this)});
    }

    dropdownSelect(value) {
        // redirect with sort param
        this.context.executeAction(navigateAction, {
            url: `/playlist/${this.props.DeckCollectionStore.collectionDetails._id}?sort=${value}`, 
        });
    }
    setEditMode(value){
        this.setState({
            editMode: value
        });
    }
    handleCancelEditOrder(){
        this.setState({
            editMode: false, 
            decksOrder: this.props.DeckCollectionStore.collectionDetails.decks.slice() // revert to inital stored order
        });
    }
    handleSaveDeckOrder(){
        // redirect to ?sort=order inside the action
        this.context.executeAction(updateCollectionDeckOrder, {
            id: this.props.DeckCollectionStore.collectionDetails._id,
            newOrder: this.state.decksOrder.map( (deck) => deck.deckID )
        });
        this.setState({
            editMode: false
        });
    }
    handleMoveUp(index){
        let newState = Object.assign({}, this.state);
        let tmp = newState.decksOrder[index];
        newState.decksOrder[index] = newState.decksOrder[index - 1];
        newState.decksOrder[index - 1] = tmp;
        this.setState(newState);
    }
    handleMoveDown(index){
        let newState = Object.assign({}, this.state);
        let tmp = newState.decksOrder[index];
        newState.decksOrder[index] = newState.decksOrder[index + 1];
        newState.decksOrder[index + 1] = tmp;
        this.setState(newState);
    }
    handleFollowCollection() {
        if (this.props.UserFollowingsStore.selectedFollowingId !== null) {
            this.context.executeAction(deleteFollowing, {
                id: this.props.UserFollowingsStore.selectedFollowingId
            });
        } else {
            this.context.executeAction(createFollowing, {
                playlistId: this.props.DeckCollectionStore.collectionDetails._id,
                userId: this.props.UserProfileStore.userid,
                followed_type: 'playlist'
            });
        }
    }
    handleRemove(index){
        let newState = Object.assign({}, this.state);
        newState.decksOrder.splice(index, 1);
        this.setState(newState);
    }
    handleAdd(newDecks){
        let newState = Object.assign({}, this.state);
        newState.decksOrder = newDecks;
        this.setState(newState);
    }
    showErrorPopup(text){
        swal({
            title: 'Error',
            text: text,
            type: 'error',
            timer: 2000,
            showCloseButton: false,
            showCancelButton: false,
            allowEscapeKey: false,
            showConfirmButton: false
        })
        .then(() => {/* Confirmed */}, (reason) => {/* Canceled */});
    }
    getIntlMessages(){
        return defineMessages({
            reorderError: {
                id: 'CollectionPanel.error.reorder',
                defaultMessage: 'An error occurred while updating deck order in the playlist...'
            }, 
            collectionTitle: {
                id: 'CollectionPanel.title',
                defaultMessage: 'Playlist'
            }, 
            collectionCreator: {
                id: 'CollectionPanel.creator',
                defaultMessage: 'Creator'
            }, 
            collectionDate: {
                id: 'CollectionPanel.date',
                defaultMessage: 'Date'
            }, 
            decksInCollectionText: {
                id: 'CollectionPanel.decks.title', 
                defaultMessage: 'Decks in Playlist'
            }, 
            editPlaylist: {
                id: 'CollectionPanel.decks.edit', 
                defaultMessage: 'Edit'
            }, 
            editPlaylistHeader: {
                id: 'CollectionPanel.decks.edit.header', 
                defaultMessage: 'Edit Playlist'                
            },
            saveReorder: {
                id: 'CollectionPanel.save.reorder', 
                defaultMessage: 'Save'
            }, 
            cancelReorder: {
                id: 'CollectionPanel.cancel.reorder', 
                defaultMessage: 'Cancel'
            },
            sortDefault: {
                id: 'CollectionPanel.sort.default', 
                defaultMessage: 'Default Order'
            }, 
            sortLastUpdated: {
                id: 'CollectionPanel.sort.lastUpdated', 
                defaultMessage: 'Last updated'
            }, 
            sortCreationDate: {
                id: 'CollectionPanel.sort.date', 
                defaultMessage: 'Creation date'
            },
            sortTitle: {
                id: 'CollectionPanel.sort.title', 
                defaultMessage: 'Title'
            },
            collectionSubscribe: {
                id: 'UserCollections.collections.subscribe',
                defaultMessage: 'Subscribe to this playlist'
            },
            collectionUnsubscribe: {
                id: 'UserCollections.collections.unsubscribe',
                defaultMessage: 'You are subscribed to this playlist, click to unsubscribe'
            },
        });
    }
    getSelectedSort(sortBy){
        switch(sortBy){
            case 'lastUpdated':
                return this.context.intl.formatMessage(this.messages.sortLastUpdated);
            case 'date': 
                return this.context.intl.formatMessage(this.messages.sortCreationDate);
            case 'title':
                return this.context.intl.formatMessage(this.messages.sortTitle);
            case 'order': 
            default: 
                return this.context.intl.formatMessage(this.messages.sortDefault);
        }

    }
    render() {

        if(this.props.DeckCollectionStore.updateCollectionDeckOrderError){
            this.showErrorPopup(this.context.intl.formatMessage(this.messages.reorderError));
        }

        let data = this.props.DeckCollectionStore.collectionDetails;

        let loadingDiv = (this.props.DeckCollectionStore.deckOrderLoading) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : '';
        
        // the user has edit rights in collection if he is the owner of the collection, or one of his user groups are assigned to the collection
        let hasEditRights = (this.props.UserProfileStore.userid && this.props.UserProfileStore.userid === data.user.id
                    || this.props.UserProfileStore.user.groups && this.props.UserProfileStore.user.groups.map((group) => group._id).includes(data.userGroup));

        // get sort text of the selected sortBy option
        let sortText = this.getSelectedSort(data.sortBy);

        return (
            <div className = "ui vertically padded stackable grid container" >
                <div className = "four wide column" >
                    <div>
                        <h3><FormattedMessage {...this.messages.collectionTitle} /></h3>
                        <h2>{data.title}</h2>
                        <h4>{data.description}</h4>
                        <div className = "ui divider" />
                            <b><FormattedMessage {...this.messages.collectionCreator} />:</b> <NavLink href={`/user/${data.user.username}`}>{data.user.displayName}</NavLink><br/>
                            <b><FormattedMessage {...this.messages.collectionDate} />:</b> {CustomDate.format(data.timestamp, 'Do MMMM YYYY')}<br/>

                        <div className = "ui divider" />
                        { (this.props.UserProfileStore.userid === '') ? '' : (this.props.UserFollowingsStore.selectedFollowingId === null) ? <button className="ui large basic icon button" data-tooltip={this.context.intl.formatMessage(this.messages.collectionSubscribe)} aria-label={this.context.intl.formatMessage(this.messages.collectionSubscribe)} onClick={this.handleFollowCollection.bind(this)} >
                            <i className="rss icon" />
                        </button> : <button className="ui large basic icon button" data-tooltip={this.context.intl.formatMessage(this.messages.collectionUnsubscribe)} aria-label={this.context.intl.formatMessage(this.messages.collectionUnsubscribe)} onClick={this.handleFollowCollection.bind(this)} >
                            <i className="rss blue icon" ></i>
                        </button> }
                    </div>
                </div>
                <div className = "twelve wide column" >
                    <div className="ui segments">
                    {loadingDiv}
                        {(data === undefined) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                        <div className="ui secondary clearing segment">
                            <h2 className="ui left floated header">{this.context.intl.formatMessage((!this.state.editMode) ? this.messages.decksInCollectionText : this.messages.editPlaylistHeader)}</h2>
                            { (!this.state.editMode && hasEditRights) && 
                                <Button primary size='small' as='button' onClick={this.setEditMode.bind(this, true)}>
                                    <Icon name='edit'/>
                                    <FormattedMessage {...this.messages.editPlaylist} />
                                </Button>
                            }
                            { (this.state.editMode) && 
                                <div className="ui right floated">
                                    <Button primary size='small' as='button' onClick={this.handleSaveDeckOrder.bind(this)}><Icon name='save'/><FormattedMessage {...this.messages.saveReorder} /></Button>
                                    <Button as='button' size='small' onClick={this.handleCancelEditOrder.bind(this)}><Icon name='close'/><FormattedMessage {...this.messages.cancelReorder} /></Button>
                                    <AddDecksModal selectedDecks={this.state.decksOrder} handleAdd={this.handleAdd.bind(this)} loggedInDisplayName={data.user.displayName} />
                                </div>
                            }
                            { (!this.state.editMode) && 
                                <div className="ui right floated pointing labeled icon dropdown button" ref="sortDropdown">
                                    <i className="icon exchange"/>
                                    <div className="text">{sortText}</div>
                                    <div className="menu">
                                        <div className={(data.sortBy === 'order') ? 'item active selected' : 'item'} data-value='order'>{this.context.intl.formatMessage(this.messages.sortDefault)}</div>
                                        <div className={(data.sortBy === 'lastUpdated') ? 'item active selected' : 'item'} data-value='lastUpdated'>{this.context.intl.formatMessage(this.messages.sortLastUpdated)}</div>
                                        <div className={(data.sortBy === 'date') ? 'item active selected' : 'item'} data-value='date'>{this.context.intl.formatMessage(this.messages.sortCreationDate)}</div>
                                        <div className={(data.sortBy === 'title') ? 'item active selected' : 'item'} data-value='title'>{this.context.intl.formatMessage(this.messages.sortTitle)}</div>
                                    </div>
                                </div>
                            }
                        </div>
                        
                        {
                            (!this.state.editMode) ? (
                                <div className="ui segment">
                                    <CollectionDecks size={0} decks={data.decks} sort={data.sortBy}/>
                                </div>
                            ) : (
                                <div className="ui vertical segment">
                                    <CollectionDecksReorder size={0} decks={this.state.decksOrder} moveUp={this.handleMoveUp.bind(this)} moveDown={this.handleMoveDown.bind(this)} remove={this.handleRemove.bind(this)} />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

CollectionPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

CollectionPanel = connectToStores(CollectionPanel, [DeckCollectionStore, UserProfileStore, UserFollowingsStore], (context, props) => {
    return {
        DeckCollectionStore: context.getStore(DeckCollectionStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        UserFollowingsStore: context.getStore(UserFollowingsStore).getState(),
    };
});

export default CollectionPanel;
