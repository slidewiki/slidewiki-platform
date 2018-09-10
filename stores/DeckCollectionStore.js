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
        this.deckOrderLoading = false;

        // needed for adding decks in playlist modal
        this.decks = undefined;
        this.decksMeta = undefined;
        this.loadMoreLoading = false;
        this.loadMoreError = false;
        this.subheader = '';

        // variables used in collection tab
        this.selector = {};
        this.deckCollections = [];
        this.removeDeckFromCollectionError = false;
        this.addDeckToCollectionError = false;
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
        this.deckOrderLoading = false;
        this.decks = undefined;
        this.decksMeta = undefined;
        this.loadMoreLoading = false;
        this.loadMoreError = false;
        this.subheader = '';
        this.selector = {};
        this.deckCollections = [];
        this.removeDeckFromCollectionError = false;
        this.addDeckToCollectionError = false;
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
            deckOrderLoading: this.deckOrderLoading,
            decks: this.decks,
            decksMeta: this.decksMeta,
            loadMoreLoading: this.loadMoreLoading,
            loadMoreError: this.loadMoreError,
            subheader: this.subheader,
            deckCollections: this.deckCollections,
            selector: this.selector,
            removeDeckFromCollectionError: this.removeDeckFromCollectionError,
            addDeckToCollectionError: this.addDeckToCollectionError,
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
        this.deckOrderLoading = state.deckOrderLoading;
        this.decks = state.decks;
        this.decksMeta = state.decksMeta;
        this.loadMoreLoading = state.loadMoreLoading;
        this.loadMoreError = state.loadMoreError;
        this.subheader = state.subheader;
        this.deckCollections = state.deckCollections;
        this.selector = state.selector;
        this.removeDeckFromCollectionError = state.removeDeckFromCollectionError;
        this.addDeckToCollectionError = state.addDeckToCollectionError;
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

    updateCollectionDeckOrderLoading(payload){
        this.deckOrderLoading = payload;
        this.emitChange();
    }

    updateDecksLoading(){
        this.decks = undefined;
        this.emitChange();
    }

    updateDecks(payload){
        this.decks = payload.decks;
        this.decksMeta = payload.metadata;
        this.emitChange();
    }

    setLoadMoreLoading(){
        this.loadMoreLoading = true;
        this.emitChange();
    }

    loadMoreDecks(payload){
        this.decks = this.decks.concat(payload.decks);
        this.decksMeta = payload.metadata;
        this.loadMoreLoading = false;
        this.loadMoreError = false;
        this.emitChange();
    }

    setLoadMoreDecksFailed() {
        this.loadMoreError = true;
        this.loadMoreLoading = false;
        this.emitChange();
        this.loadMoreError = false;
    }

    setLoading() {
        this.decks = undefined;
        this.emitChange();
    }

    loadRecentDecks(payload) {
        // also add _id in deckID field
        payload.recent.forEach( (deck) => {
            deck.deckID = deck._id;
            deck.creationDate = deck.timestamp;
        });
        this.decks = payload.recent;
        this.decksMeta = undefined;
        this.emitChange();
    }

    loadSearchResults(payload) {
        // transform search results
        payload.docs.forEach( (deck) => {
            deck.deckID = deck.db_id;
            deck.creationDate = deck.timestamp;
            deck.username = deck.user.username;
            deck.countRevisions = deck.revisionCount;
        });

        // more results have been loaded
        if (payload.page > 1) {
            this.decks = this.decks.concat(payload.docs);
            this.loadMoreLoading = false;
            this.loadMoreError = false;

        // page 1 of results is requested
        } else {
            this.decks = payload.docs;
        }

        this.decksMeta = {};

        // form next page link if more results are available
        if (payload.hasMore) {
            this.decksMeta.links = payload.links;
        } else {
            this.decksMeta.links = {};
        }

        this.emitChange();
    }

    setSubtitle(payload) {
        this.subheader = payload;
        this.emitChange();
    }

    updateDeckCollections(payload){
        this.deckCollections = payload.collections;
        this.selector = payload.selector;
        this.emitChange();
    }

    removeDeckFromCollection(payload){
        let removedCollectionId = parseInt(payload.collectionId);
        this.deckCollections = this.deckCollections.filter( (col) => col._id !== removedCollectionId);
        this.removeDeckFromCollectionError = false;
        this.emitChange();
    }

    removeDeckFromCollectionFailed(){
        this.removeDeckFromCollectionError = true;
        this.emitChange();
        this.removeDeckFromCollectionError = false;
        this.emitChange();
    }

    addDeckToCollection(collection){
        this.deckCollections.unshift(collection);
        this.addDeckToCollectionError = false;
        this.emitChange();
    }

    addDeckToCollectionFailed(){
        this.addDeckToCollectionError = true;
        this.emitChange();
        this.addDeckToCollectionError = false;
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
    'UPDATE_COLLECTION_DECK_ORDER_LOADING': 'updateCollectionDeckOrderLoading',
    'UPDATE_COLLECTION_DECK_ORDER_FAILURE': 'updateCollectionDeckOrderFailed',

    'SET_COLLECTIONS_LOADING': 'startLoading',


    // needed for adding decks in playlist modal
    'NEW_USER_DECKS_LOADING': 'updateDecksLoading',
    'NEW_USER_DECKS': 'updateDecks',

    'FETCH_NEXT_USER_DECKS_LOADING': 'setLoadMoreLoading',
    'FETCH_NEXT_USER_DECKS': 'loadMoreDecks',
    'FETCH_NEXT_USER_DECKS_FAILED': 'setLoadMoreDecksFailed',

    'ATTACHSUBDECK_LOAD_RECENTDECKS_LOADING': 'setLoading',
    'ATTACHSUBDECK_LOAD_RECENTDECKS': 'loadRecentDecks',

    'ATTACHSUBDECK_LOAD_SEARCHDECKS_LOADING': 'setLoading',
    'ATTACHSUBDECK_LOAD_SEARCHDECKS': 'loadSearchResults',

    'SHOW_LOAD_MORE_LOADING': 'setLoadMoreLoading',
    'LOAD_MORE_RESULTS_SUCCESS': 'loadSearchResults',
    'LOAD_RESULTS_FAILURE': 'setLoadMoreDecksFailed',
    'UPDATE_ADD_DECKS_TO_COLLECTION_MODAL_SUBTITLE': 'setSubtitle',
    // handlers used for collection tab
    'LOAD_DECK_COLLECTIONS_SUCCESS': 'updateDeckCollections',
    'LOAD_DECK_COLLECTIONS_FAILURE': 'updateDeckCollectionsFailed',

    'REMOVE_DECK_FROM_COLLECTION_SUCCESS': 'removeDeckFromCollection',
    'REMOVE_DECK_FROM_COLLECTION_FAILURE': 'removeDeckFromCollectionFailed',

    'ADD_DECK_TO_COLLECTION_SUCCESS': 'addDeckToCollection',
    'ADD_DECK_TO_COLLECTION_FAILURE': 'addDeckToCollectionFailed',
};

export default DeckCollectionStore;
