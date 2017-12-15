import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import DeckCollectionStore from '../../stores/DeckCollectionStore';
import UserProfileStore from '../../stores/UserProfileStore';
import deleteCollection from '../../actions/collections/deleteCollection';
import { connectToStores } from 'fluxible-addons-react';
import NewCollectionModal from './Modals/NewCollectionModal';
import UpdateCollectionModal from './Modals/UpdateCollectionModal';
import {FormattedMessage, defineMessages} from 'react-intl';

class UserCollections extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};

        this.state = {
            showNewCollectionModal: false, 
            showUpdateCollectionModal: false,
            updateCollectionDetails: {}
        };

        this.messages = this.getIntlMessages();
    }

    showNewCollectionModal(event){
        event.preventDefault();
        this.setState({
            showNewCollectionModal: true
        });
    }

    handleClickOnEditCollection(collection) {
        this.setState({
            showUpdateCollectionModal: true,
            updateCollectionDetails: collection
        });
    }

    handleDeleteCollection(colId) {
        this.context.executeAction(deleteCollection, {
            id: colId
        });
    }

    showErrorPopup(text){
        let title = this.context.intl.formatMessage(this.messages.errorText);
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

    getIntlMessages(){
        return defineMessages({
            errorText: {
                id: 'UserCollections.error.text',
                defaultMessage: 'Error'
            },
            readError: {
                id: 'UserCollections.error.read',
                defaultMessage: 'An error occurred while fetching deck collections. Please try again later.'
            },
            deleteError: {
                id: 'UserCollections.error.delete',
                defaultMessage: 'An error occurred while deleting collection...'
            }, 
            createError: { 
                id: 'UserCollections.error.create',
                defaultMessage: 'An error occurred while creating collection....'
            }, 
            updateError: {
                id: 'UserCollections.error.update',
                defaultMessage: 'An error occured while updating collection...'
            }, 
            noCollectionsFound: {
                id: 'UserCollections.collections.empty',
                defaultMessage: 'No deck collections available'
            }, 
            collectionCreate: {
                id: 'UserCollections.collections.create',
                defaultMessage: 'Create new collection'
            },
            collectionDelete: {
                id: 'UserCollections.collections.delete',
                defaultMessage: 'Delete Collection'
            }, 
            collectionSettings: {
                id: 'UserCollections.collections.settings',
                defaultMessage: 'Collection Settings'
            }, 
            myCollectionsTitle: {
                id: 'UserCollections.collections.mycollections',
                defaultMessage: 'My Deck Collections'
            }, 
            ownedCollectionsTitle: {
                id: 'UserCollections.collections.owned',
                defaultMessage: 'Owned Deck Collections'
            }, 
            deckText: {
                id: 'UserCollections.deck', 
                defaultMessage: 'deck'
            }, 
            decksText: {
                id: 'UserCollections.decks', 
                defaultMessage: 'decks'
            }, 
            shareCollectionText: {
                id: 'UserCollections.collections.shared', 
                defaultMessage: 'Shared Collection'
            }
        });
    }

    render() {
        

        let content = '';
        let loadingDiv = '';
        let collections = this.props.DeckCollectionStore.collections;

        // error loading deck collections
        if(this.props.DeckCollectionStore.updateCollectionsError){
            content = (
                <h3><FormattedMessage {...this.messages.readError} /></h3>
            );
        // show pop-ups when error occurs
        } else if(this.props.DeckCollectionStore.deleteDeckCollectionError){
            this.showErrorPopup(this.context.intl.formatMessage(this.messages.deleteError));
        } else if(this.props.DeckCollectionStore.addCollectionError){
            this.showErrorPopup(this.context.intl.formatMessage(this.messages.createError));
        } else if(this.props.DeckCollectionStore.updateCollectionMetadataError){
            this.showErrorPopup(this.context.intl.formatMessage(this.messages.updateError));
        }
        
        // just show loading indicator
        if (collections === undefined){
            loadingDiv = (this.props.DeckCollectionStore.loading) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : '';

        // collections is undefined when loading indicator is shown
        } else {

            if(collections.documents.length === 0){
                content = (
                    <center><h3><FormattedMessage {...this.messages.noCollectionsFound} /></h3></center>
                );
            } else {

                content = collections.documents.map( (col) => {
                    return (
                        <div key={col._id} className="ui vertical segment">
                            <div className="ui two column stackable grid container">
                                <div className="column">
                                    <div className="ui header"><h3><a href={`/collection/${col._id}`}>{col.title}</a></h3></div>
                                    <div className="meta">{col.description} {(col.description) ? '\u00b7' : ''}  {col.decks.length} {this.context.intl.formatMessage((col.decks.length === 1) ? this.messages.deckText : this.messages.decksText)} {(col.userGroup) ? '\u00b7' : ''} {(col.userGroup) ? <i className="users icon" title={this.context.intl.formatMessage(this.messages.shareCollectionText)}></i> : ''}</div>
                                </div>

                                <div className="right aligned column">
                                    {(this.props.loggedinUserId === col.user) ? (
                                      <div>
                                          <button className="ui large basic icon button" data-tooltip={this.context.intl.formatMessage(this.messages.collectionDelete)} aria-label={this.context.intl.formatMessage(this.messages.collectionDelete)} onClick={this.handleDeleteCollection.bind(this, col._id)} >
                                              <i className="remove icon" name={'deleteCollection_' + col._id} ></i>
                                          </button>
                                          <button className="ui large basic icon button" data-tooltip={this.context.intl.formatMessage(this.messages.collectionSettings)} aria-label={this.context.intl.formatMessage(this.messages.collectionSettings)} name={col._id} onClick={this.handleClickOnEditCollection.bind(this, col)} >
                                              <i className="setting icon" name={'editCollection' + col._id} ></i>
                                          </button>
                                      </div>
                                    ) : ''}
                                </div>
                            </div>
                        </div>
                    );
                });
            }
        }

        return (
            <div className="ui segments">
                {loadingDiv}
                <div className="ui secondary clearing segment">
                    <h2 className="ui left floated header">{this.context.intl.formatMessage((this.props.loggedinuser === this.props.user.uname) ? this.messages.myCollectionsTitle :this.messages.ownedCollectionsTitle)}</h2>
                    {(this.props.loggedinuser === this.props.user.uname) &&
                        <button className="ui right floated button" role="button" tabIndex="0" onClick={this.showNewCollectionModal.bind(this)}>
                          <p><FormattedMessage {...this.messages.collectionCreate} /></p>
                        </button>
                    }
                </div>
                <div className="ui vertical segment">
                    {content}
                </div>
                <NewCollectionModal isOpen={this.state.showNewCollectionModal} handleClose={() => this.setState({showNewCollectionModal: false})} userGroups={this.props.UserProfileStore.user.groups} loggedInUser={this.props.UserProfileStore.userid} />
                <UpdateCollectionModal collection={this.state.updateCollectionDetails} isOpen={this.state.showUpdateCollectionModal} handleClose={() => this.setState({showUpdateCollectionModal: false})} userGroups={this.props.UserProfileStore.user.groups} loggedInUser={this.props.UserProfileStore.userid} />
            </div>
        );
    }
}

UserCollections.contextTypes = {
    executeAction: React.PropTypes.func.isRequired, 
    intl: React.PropTypes.object.isRequired
};

UserCollections = connectToStores(UserCollections, [DeckCollectionStore, UserProfileStore], (context, props) => {
    return {
        DeckCollectionStore: context.getStore(DeckCollectionStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
    };
});

export default UserCollections;
