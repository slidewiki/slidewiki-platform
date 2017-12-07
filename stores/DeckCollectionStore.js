import { BaseStore } from 'fluxible/addons';

class DeckCollectionStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);

        this.collections = undefined;
        this.updateCollectionsError = false;
        this.deleteDeckCollectionError = false;

        this.loading = false;
    }

    destructor() {
        this.collections = undefined;
        this.updateCollectionsError = false;
        this.deleteDeckCollectionError = false;
        this.loading = false;
    }

    getState() {
        return { 
            collections: this.collections,
            updateCollectionsError: this.updateCollectionsError, 
            deleteDeckCollectionError: this.deleteDeckCollectionError,
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

}

DeckCollectionStore.storeName = 'DeckCollectionStore';
DeckCollectionStore.handlers = {

    'LOAD_USER_COLLECTIONS_SUCCESS': 'updateCollections', 
    'LOAD_USER_COLLECTIONS_FAILURE': 'updateCollectionsFailed', 
    
    'DELETE_COLLECTION_SUCCESS': 'deleteCollection', 
    'DELETE_COLLECTION_FAILURE': 'deleteCollectionFailed',

    'SET_COLLECTIONS_LOADING': 'startLoading',
};

export default DeckCollectionStore;
