import { BaseStore } from 'fluxible/addons';
import slugify from 'slugify';

class DeckCollectionStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);

        this.collections = undefined;
        this.updateCollectionsError = false;
        this.deleteDeckCollectionError = false;
        this.collectionDetails = undefined;
        this.collectionDetailsError = false;
        this.addCollectionError = false;
        this.updateCollectionMetadataError = false;
        this.updateCollectionDeckOrderError = false;
        this.loading = false;

        // variables used in collection tab
        this.selector = {};
        this.deckCollections = [];
    }

    destructor() {
        this.collections = undefined;
        this.updateCollectionsError = false;
        this.deleteDeckCollectionError = false;
        this.collectionDetails = undefined;
        this.collectionDetailsError = false;
        this.addCollectionError = false;
        this.updateCollectionMetadataError = false;
        this.updateCollectionDeckOrderError = false;
        this.loading = false;
        this.selector = {};
        this.deckCollections = [];
    }

    getState() {
        return {
            collections: this.collections,
            updateCollectionsError: this.updateCollectionsError,
            deleteDeckCollectionError: this.deleteDeckCollectionError,
            collectionDetails: this.collectionDetails,
            collectionDetailsError: this.collectionDetailsError,
            addCollectionError: this.addCollectionError,
            updateCollectionMetadataError: this.updateCollectionMetadataError,
            updateCollectionDeckOrderError: this.updateCollectionDeckOrderError,
            loading: this.loading, 
            deckCollections: this.deckCollections, 
            selector: this.selector, 
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.collections = state.collections;
        this.updateCollectionsError = state.updateCollectionsError;
        this.deleteDeckCollectionError = state.deleteDeckCollectionError;
        this.collectionDetails = state.collectionDetails;
        this.collectionDetailsError = state.collectionDetailsError;
        this.addCollectionError = state.addCollectionError;
        this.updateCollectionMetadataError = state.updateCollectionMetadataError;
        this.updateCollectionDeckOrderError = state.updateCollectionDeckOrderError;
        this.loading = state.loading;
        this.deckCollections = state.deckCollections;
        this.selector = state.selector; 
    }

    updateCollections(payload){
        this.collections = payload;
        this.updateCollectionsError = false;
        this.loading = false;
        this.emitChange();
    }

    updateCollectionsFailed(){
        this.collections = {};
        this.updateCollectionsError = true;
        this.loading = false;
        this.emitChange();
    }

    deleteCollection(payload){
        let deletedCollectionId = payload.id;

        // remove deleted id from the collections
        let updatedCollections = this.collections.documents.filter( (col) => {
            return (col._id !== deletedCollectionId);
        });
        this.collections.documents = updatedCollections;
        this.deleteDeckCollectionError = false;
        this.loading = false;
        this.emitChange();
    }

    deleteCollectionFailed(){
        this.deleteDeckCollectionError = true;
        this.loading = false;
        this.emitChange();
        this.deleteDeckCollectionError = false;
    }

    startLoading(){
        this.loading = true;
        this.emitChange();
    }

    updateCollectionDetails(payload){

        // format the results of the service
        payload.decks.forEach((deck) => {
            Object.assign(deck, {
                deckID: deck._id,
                slug: slugify(deck.title || '').toLowerCase() || '_',
                updated: deck.lastUpdate,
                creationDate: deck.timestamp,
            });
        });

        this.collectionDetails = payload;
        this.collectionDetailsError = false;
        this.emitChange();
    }

    updateCollectionDetailsFailed(){
        this.collectionDetailsError = true;
        this.emitChange();
    }

    addCollection(newCollection){
        this.collections.documents.push(newCollection);
        this.collections.documents = [...new Set(this.collections.documents)];
        this.emitChange();
    }

    addCollectionFailure(){
        this.addCollectionError = true;
        this.emitChange();
        this.addCollectionError = false;
        this.emitChange();
    }

    updateCollectionMetadata(updatedCollection){

        // replace the collection that has just been updated
        this.collections.documents = this.collections.documents.map( (col) => {
            return (col._id === updatedCollection._id) ? updatedCollection : col;
        });

        this.emitChange();
    }

    updateCollectionMetadataFailed(){
        this.updateCollectionMetadataError = true;
        this.emitChange();
        this.updateCollectionMetadataError = false;
        this.emitChange();
    }

    updateCollectionDeckOrder(payload){
        // new deck order in the collection
        let order = payload.decks;

        // update the order of the collectionDetails.decks array
        this.collectionDetails.decks = this.collectionDetails.decks.sort( (a,b) => {
            return order.indexOf(a.deckID) > order.indexOf(b.deckID);
        });
        this.updateCollectionDeckOrderError = false;
        this.emitChange();
    }

    updateCollectionDeckOrderFailed(){
        this.updateCollectionDeckOrderError = true;
        this.emitChange();
        this.updateCollectionDeckOrderError = false;
        this.emitChange();
    }

    updateDeckCollections(payload){
        this.deckCollections = payload.collections;
        this.selector = payload.selector;
        this.emitChange();
    }
}

DeckCollectionStore.storeName = 'DeckCollectionStore';
DeckCollectionStore.handlers = {

    'LOAD_USER_COLLECTIONS_SUCCESS': 'updateCollections',
    'LOAD_USER_COLLECTIONS_FAILURE': 'updateCollectionsFailed',

    'DELETE_COLLECTION_SUCCESS': 'deleteCollection',
    'DELETE_COLLECTION_FAILURE': 'deleteCollectionFailed',

    'LOAD_COLLECTION_DETAILS_SUCCESS': 'updateCollectionDetails',
    'LOAD_COLLECTION_DETAILS_FAILURE': 'updateCollectionDetailsFailed',

    'ADD_COLLECTION_SUCCESS': 'addCollection',
    'ADD_COLLECTION_FAILURE': 'addCollectionFailure',

    'UPDATE_COLLECTION_METADATA': 'updateCollectionMetadata',
    'UPDATE_COLLECTION_METADATA_ERROR': 'updateCollectionMetadataFailed',

    'UPDATE_COLLECTION_DECK_ORDER_SUCCESS': 'updateCollectionDeckOrder',
    'UPDATE_COLLECTION_DECK_ORDER_FAILURE': 'updateCollectionDeckOrderFailed',

    'SET_COLLECTIONS_LOADING': 'startLoading',

    // handlers used for collection tab
    'LOAD_DECK_COLLECTIONS_SUCCESS': 'updateDeckCollections', 
    'LOAD_DECK_COLLECTIONS_FAILURE': 'updateDeckCollectionsError',
};

export default DeckCollectionStore;
