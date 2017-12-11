import { BaseStore } from 'fluxible/addons';

class DeckCollectionStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);

        this.collections = undefined;
        this.updateCollectionsError = false;
        this.deleteDeckCollectionError = false;
        this.collectionDetails = undefined;
        this.collectionDetailsError = false;
        this.loading = false;
    }

    destructor() {
        this.collections = undefined;
        this.updateCollectionsError = false;
        this.deleteDeckCollectionError = false;
        this.collectionDetails = undefined;
        this.collectionDetailsError = false;
        this.loading = false;
    }

    getState() {
        return { 
            collections: this.collections,
            updateCollectionsError: this.updateCollectionsError, 
            deleteDeckCollectionError: this.deleteDeckCollectionError,
            collectionDetails: this.collectionDetails,
            collectionDetailsError: this.collectionDetailsError,
            loading: this.loading
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
        this.loading = state.loading;
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
        payload.decks = payload.decks.map( (deck) => {

            // get the active revision of the deck 
            let activeRevision = deck.revisions[deck.revisions.length-1];
            return {
                deckID: deck._id, 
                title: activeRevision.title, 
                firstSlide: activeRevision.firstSlide, 
                updated: deck.lastUpdate, 
                description: deck.description, 
                creationDate: deck.timestamp
            };
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
        this.emitChange();
    }

    addCollectionFailure(){

    }

    updateCollectionMetadata(updatedCollection){

        // replace the collection that has just been updated
        this.collections.documents = this.collections.documents.map( (col) => {          
            return (col._id === updatedCollection._id) ? updatedCollection : col;
        });
        
        this.emitChange();
    }   

    updateCollectionMetadataFailed(){

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

    'SET_COLLECTIONS_LOADING': 'startLoading',
};

export default DeckCollectionStore;
