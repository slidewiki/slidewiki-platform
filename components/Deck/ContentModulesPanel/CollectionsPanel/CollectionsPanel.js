import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import classNames from 'classnames';
import DeckCollectionStore from '../../../../stores/DeckCollectionStore';
import { defineMessages } from 'react-intl';
import CollectionsList from './CollectionsList';
import UserProfileStore from '../../../../stores/UserProfileStore';
import { Dropdown } from 'semantic-ui-react';
import addDeckToCollection from '../../../../actions/collections/addDeckToCollection';
import NewCollectionModal from '../../../DeckCollection/Modals/NewCollectionModal';
import { Divider } from 'semantic-ui-react'

class CollectionsPanel extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
        this.userCollections = [];
        this.state = {
            showNewCollectionModal: false,
            currentSelection: '',
        };
    }
    componentDidMount() {
        this.initDropbox();
    }
    initDropbox(){
        let addCollection = this.addCollection.bind(this);
        $('#playlistsDropdown').dropdown({
            action: (text, value, element) => {
                $('#playlistsDropdown').dropdown('clear');
                $('#playlistsDropdown').dropdown('hide');
                addCollection(value);
            }
        });
    }
    getIntlMessages() {
        return defineMessages({
            header: {
                id: 'CollectionsPanel.header',
                defaultMessage: 'Playlists'
            },
            createCollection: {
                id: 'CollectionsPanel.createCollection', 
                defaultMessage: 'Add to new playlist'
            },
            ariaCreateCollection: {
                id: 'CollectionsPanel.ariaCreateCollection', 
                defaultMessage: 'Add to new playlist'
            },
            errorTitle: {
                id: 'CollectionsPanel.error.title',
                defaultMessage: 'Error'
            },
            removeDeckError: {
                id: 'CollectionsPanel.error.removeDeck', 
                defaultMessage: 'An error occured while removing playlist from deck...'
            }, 
            addDeckError: {
                id: 'CollectionsPanel.error.adDeck', 
                defaultMessage: 'An error occured while adding playlist to the deck...'                
            },
            addToPlaylist: {
                id: 'CollectionsPanel.addToPlaylist', 
                defaultMessage: 'Add deck to playlist'                
            },

        });
    }
    showNewCollectionModal(event){
        event.preventDefault();
        this.setState({
            showNewCollectionModal: true
        });
    }
    showErrorPopup(text){
        let title = this.context.intl.formatMessage(this.messages.errorTitle);
        swal({
            title: title,
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
    addCollection(collectionId){
        let deckId = this.props.DeckCollectionStore.selector.sid;
        let collectionDetails = {};

        // transform collection details from array to json
        collectionDetails = this.userCollections.reduce((details, value, key) => {
            details[value._id] = value; return details;
        }, {});

        let collectionToAdd = collectionDetails[collectionId];
        this.context.executeAction(addDeckToCollection, {
            collectionId: collectionToAdd._id,
            deckId: deckId,
            collection: collectionToAdd,
        });

        this.setState({
            currentSelection: ''
        });
    }
    render() {
        if (this.props.DeckCollectionStore.removeDeckFromCollectionError) {
            this.showErrorPopup(this.context.intl.formatMessage(this.messages.removeDeckError));
        } else if (this.props.DeckCollectionStore.addDeckToCollectionError) {
            this.showErrorPopup(this.context.intl.formatMessage(this.messages.addDeckError));  
        }

        const userId = this.props.UserProfileStore.userid;
        const selector = this.props.DeckCollectionStore.selector;
        const groups = this.props.UserProfileStore.user.groups;
        const groupIds = (groups || []).map( (group) => group.id);

        // collections of the current deck
        const deckCollections = this.props.DeckCollectionStore.deckCollections;

        // collections that the user has edit rights
        this.userCollections = [];
        if (this.props.DeckCollectionStore.collections !== undefined) {
            this.userCollections = this.props.DeckCollectionStore.collections.documents;
        }
        
        // find collection dropdown options
        let deckCollectionIds = deckCollections.map( (col) => col._id);
        let collectionDropdownOptions = this.userCollections.filter( (collection) => {

            // exclude collections that are already selected
            return !deckCollectionIds.includes(collection._id);
        }).map( (collection) => {
            return <div key={collection._id} className="item" data-value={collection._id}>{collection.title}</div>;
        });

        return (
            <div className="ui bottom attached" ref="tagsPanel">
                            <h3 className="ui dividing header">{this.context.intl.formatMessage(this.messages.header)}</h3>

                    <div className="ui stackable grid">

                    {   (userId) &&
                        <div className="row">
                            <div className="sixteen wide column">
                                <h4 className="ui header">{this.context.intl.formatMessage(this.messages.addToPlaylist)}</h4>
                            </div>
                            <Divider hidden />
                            <div className="eleven wide column">
                                <div id="playlistsDropdown" value={this.state.currentSelection} className="ui fluid search selection dropdown" aria-labelledby="playlists">
                                    <input type="hidden" name="playlists" />
                                    <i className="dropdown icon"></i>
                                    <div className="default text">Select to add a playlist</div>
                                    <div className="menu">
                                        {collectionDropdownOptions}
                                    </div>
                                </div>
                            </div>
                            <div className="five wide column">
                                <button className="ui small blue labeled icon right floated button" aria-label={this.context.intl.formatMessage(this.messages.ariaCreateCollection)} onClick={this.showNewCollectionModal.bind(this)}>
                                    <i className="icon plus"></i>{this.context.intl.formatMessage(this.messages.createCollection)}
                                </button>
                            </div>
                        </div>
                    }
                    <div className="row">
                        <div className="sixteen wide column">
                            <CollectionsList collections={deckCollections} selector={selector} userId={userId} userGroups={groupIds} />
                        </div>
                    </div>
                </div>
                <NewCollectionModal isOpen={this.state.showNewCollectionModal} handleClose={() => this.setState({showNewCollectionModal: false})} userGroups={groups} loggedInUser={userId} deckId={selector.sid} />
            </div>
        );
    }
}

CollectionsPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

CollectionsPanel = connectToStores(CollectionsPanel, [DeckCollectionStore, UserProfileStore], (context, props) => {
    return {
        DeckCollectionStore: context.getStore(DeckCollectionStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
    };
});

export default CollectionsPanel;
