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
    getIntlMessages() {
        return defineMessages({
            header: {
                id: 'CollectionsPanel.header',
                defaultMessage: 'Playlists'
            },
            createCollection: {
                id: 'CollectionsPanel.createCollection', 
                defaultMessage: 'Create new playlist'
            },
            ariaCreateCollection: {
                id: 'CollectionsPanel.ariaCreateCollection', 
                defaultMessage: 'Create a new playlist'
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
            }
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
    addCollection(deckId, event, data){
        let collectionId = data.value;
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
        const groupIds = (this.props.UserProfileStore.user.groups || []).map( (group) => group.id);

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
            return {
                key: collection._id,
                value: collection._id,
                text: collection.title
            };
        });

        return (
            <div className="ui bottom attached" ref="tagsPanel">
                <div className="ui stackable grid">
                    <div className="row">
                        <div className="middle aligned eight wide column">
                            <h3 className="ui header">{this.context.intl.formatMessage(this.messages.header)}</h3>
                        </div>
                        <div className="eight wide right aligned column">
                            <button className="ui small blue labeled icon right floated button" aria-label={this.context.intl.formatMessage(this.messages.ariaCreateCollection)} onClick={this.showNewCollectionModal.bind(this)}>
                                <i className="icon plus"></i>{this.context.intl.formatMessage(this.messages.createCollection)}
                            </button>
                        </div>
                    </div>
                    {   (userId) &&
                        <div className="row">
                            <div className="sixteen wide column">
                                <Dropdown value={this.state.currentSelection} placeholder='Select to add a playlist' fluid search selection options={collectionDropdownOptions} onChange={this.addCollection.bind(this, selector.sid)} />
                            </div>
                        </div>
                    }
                    <div className="row">
                        <div className="sixteen wide column">
                            <CollectionsList collections={deckCollections} selector={selector} userId={userId} userGroups={groupIds} />
                        </div>
                    </div>
                </div>
                <br/>
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
