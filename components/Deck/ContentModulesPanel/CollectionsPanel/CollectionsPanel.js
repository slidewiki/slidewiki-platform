import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import classNames from 'classnames';
import DeckCollectionStore from '../../../../stores/DeckCollectionStore';
import { defineMessages } from 'react-intl';
import CollectionsList from './CollectionsList';
import UserProfileStore from '../../../../stores/UserProfileStore';

class CollectionsPanel extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
        this.state = {
            showNewCollectionModal: false,
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
                defaultMessage: 'Create playlist'
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
    render() {
        if (this.props.DeckCollectionStore.removeDeckFromCollectionError) {
            this.showErrorPopup(this.context.intl.formatMessage(this.messages.removeDeckError));
        }

        const groupIds = (this.props.UserProfileStore.user.groups || []).map( (group) => group.id);

        return (
            <div className="ui bottom attached" ref="tagsPanel">
                <div className="ui stackable grid">
                    <div className="row">
                        <div className="eight wide column">
                            <h3 className="ui header">{this.context.intl.formatMessage(this.messages.header)}</h3>
                        </div>
                        <div className="eight wide right aligned column">
                            <button className="ui small blue labeled icon right floated button" aria-label={this.context.intl.formatMessage(this.messages.ariaCreateCollection)} onClick={this.showNewCollectionModal.bind(this)}>
                                <i className="icon plus"></i>{this.context.intl.formatMessage(this.messages.createCollection)}
                            </button>
                        </div>
                    </div>
                    <div className="row">
                       <div className="sixteen wide column">
                            <CollectionsList collections={this.props.DeckCollectionStore.deckCollections} selector={this.props.DeckCollectionStore.selector} userId={this.props.UserProfileStore.userid} userGroups={groupIds} />
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
