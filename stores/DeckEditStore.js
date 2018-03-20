import {BaseStore} from 'fluxible/addons';
const common = require('../common.js');

class DeckEditStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckProps = {};
        this.editors = [];
        this.authorizedUsers = [];
        this.authorizedGroups = [];
        this.viewstate = '';
        this.detailedGroup = {
            name: '',
            id: 0,
            creator: {
                userid: 0
            },
            members: []
        };
        this.originalEditors = {
            users: [],
            groups: []
        };
        this.collectionOptions = [];
        this.selectedCollections = [];

        this.showGroupModal = false;

<<<<<<< HEAD
        // variables for error handling 
=======
        this.queryParams = {};

        // variables for error handling
>>>>>>> master
        this.loadCollectionsError = false;
        this.addCollectionError = false;
        this.collectionsLoading = false;
    }

    updateProperties(payload) {
        this.deckProps = payload.deckProps;
        this.editors = payload.editors;

        //edit rights adoptions
        this.authorizedUsers = JSON.parse(JSON.stringify(payload.deckProps.editors.users));
        this.authorizedGroups = JSON.parse(JSON.stringify(payload.deckProps.editors.groups));
        this.originalEditors = JSON.parse(JSON.stringify(payload.deckProps.editors));
        // console.log('Now we have new origin editors:', this.originalEditors);

        this.emitChange();
    }

    resetProperties() {
        this.originalEditors = {
            users: [],
            groups: []
        };

        this.selectedCollections = [];

        this.emitChange();
    }

    getState() {
        return {
            deckProps: this.deckProps,
            editors: this.editors,
            authorizedUsers: this.authorizedUsers,
            authorizedGroups: this.authorizedGroups,
            viewstate: this.viewstate,
            detailedGroup: this.detailedGroup,
            originalEditors: this.originalEditors,
<<<<<<< HEAD
            showGroupModal: this.showGroupModal, 
            collectionOptions: this.collectionOptions,
            selectedCollections: this.selectedCollections,
            loadCollectionsError: this.loadCollectionsError, 
=======
            showGroupModal: this.showGroupModal,
            queryParams: this.queryParams,
            showGroupModal: this.showGroupModal,
            collectionOptions: this.collectionOptions,
            selectedCollections: this.selectedCollections,
            loadCollectionsError: this.loadCollectionsError,
>>>>>>> master
            addCollectionError: this.addCollectionError,
            collectionsLoading: this.collectionsLoading
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.deckProps = state.deckProps;
        this.editors = state.editors;
        this.authorizedUsers = state.authorizedUsers;
        this.viewstate = state.viewstate;
        this.authorizedGroups = state.authorizedGroups;
        this.detailedGroup = state.detailedGroup;
        this.originalEditors = state.originalEditors;
        this.showGroupModal = state.showGroupModal;
<<<<<<< HEAD
        this.collectionOptions = state.collectionOptions;
        this.selectedCollections = state.selectedCollections;
        this.loadCollectionsError = state.loadCollectionsError; 
=======
        this.queryParams = state.queryParams;
        this.collectionOptions = state.collectionOptions;
        this.selectedCollections = state.selectedCollections;
        this.loadCollectionsError = state.loadCollectionsError;
>>>>>>> master
        this.addCollectionError = state.addCollectionError;
        this.collectionsLoading = state.collectionsLoading;
    }

    updateAuthorizedUsers(users) {
        this.authorizedUsers = users;
        this.emitChange();
    }

    updateAuthorizedGroups(groups) {
        this.authorizedGroups = groups;
        this.emitChange();
    }

    updateViewState(newState) {
        this.viewstate = newState;
        this.emitChange();
    }

    loadUsergroup(group) {
        // console.log('DeckEditStore loadUsergroup:', group);
        this.detailedGroup = group;
        this.showGroupModal = true;
        this.emitChange();
        this.showGroupModal = false;
    }

<<<<<<< HEAD
=======
    setQueryParams(params) {
        this.queryParams = params;
        this.emitChange();
    }

>>>>>>> master
    loadUserCollections(payload){
        this.collectionOptions = payload.documents;
        this.emitChange();
    }

    loadCollections(payload){
        this.selectedCollections = payload.map( (collection) => {
            return collection._id;
        });
        this.emitChange();
    }

    loadCollectionsFail(){
        this.loadCollectionsError = true;
        this.emitChange();
        this.loadCollectionsError = false;
    }

<<<<<<< HEAD
    addCollection(newCollection){        
=======
    addCollection(newCollection){
>>>>>>> master
        this.collectionOptions.push(newCollection);
        this.collectionOptions = [...new Set(this.collectionOptions)];
        this.selectedCollections.push(newCollection._id);

        this.emitChange();
    }

    addCollectionFailure(){
        this.addCollectionError = true;
        this.emitChange();
        this.addCollectionError = false;
    }

    addSelectedCollection(groupId){
        this.selectedCollections.push(groupId);
        this.emitChange();
    }

    removeSelectedCollection(groupId){
        this.selectedCollections = this.selectedCollections.filter( (e) => {
            return e !== groupId;
        });
        this.emitChange();
    }

    updateCollectionsLoading(payload){
        this.collectionsLoading = payload;
        this.emitChange();
    }
<<<<<<< HEAD
=======

    hideGroupsDetailsModal() {
        this.showGroupModal = false;
        this.emitChange();
    }
>>>>>>> master
}

DeckEditStore.storeName = 'DeckEditStore';
DeckEditStore.handlers = {
    'LOAD_DECK_PROPS_SUCCESS': 'updateProperties',
    'UPDATE_AUTHORIZED_USERS': 'updateAuthorizedUsers',
    'UPDATE_AUTHORIZED_GROUPS': 'updateAuthorizedGroups',
    'UPDATE_DECKEDIT_VIEW_STATE': 'updateViewState',
    'DECKEDIT_LOAD_USERGROUP': 'loadUsergroup',
<<<<<<< HEAD
    'LOAD_DECK_PROPS_FAILURE': 'resetProperties', 

    // load user groups created by a specific user
    'LOAD_USER_COLLECTIONS_SUCCESS': 'loadUserCollections', 
    'LOAD_USER_COLLECTIONS_FAILURE': 'loadCollectionsFail', 

    // load deck groups assigned to a deck
    'LOAD_COLLECTIONS_SUCCESS': 'loadCollections', 
    'LOAD_COLLECTIONS_FAILURE': 'loadCollectionsFail',
    'UPDATE_COLLECTIONS_LOADING': 'updateCollectionsLoading', 

    'ADD_COLLECTION_SUCCESS': 'addCollection', 
    'ADD_COLLECTION_FAILURE': 'addCollectionFailure', 

    // add/remove selected deck groups
    'ADD_SELECTED_COLLECTION': 'addSelectedCollection',
    'REMOVE_SELECTED_COLLECTION': 'removeSelectedCollection'
=======
    'LOAD_DECK_PROPS_FAILURE': 'resetProperties',
    'DECKEDIT_START_QUERY_PARAMS': 'setQueryParams',

    // load user groups created by a specific user
    'LOAD_USER_COLLECTIONS_SUCCESS': 'loadUserCollections',
    'LOAD_USER_COLLECTIONS_FAILURE': 'loadCollectionsFail',

    // load deck groups assigned to a deck
    'LOAD_COLLECTIONS_SUCCESS': 'loadCollections',
    'LOAD_COLLECTIONS_FAILURE': 'loadCollectionsFail',
    'UPDATE_COLLECTIONS_LOADING': 'updateCollectionsLoading',

    'ADD_COLLECTION_SUCCESS': 'addCollection',
    'ADD_COLLECTION_FAILURE': 'addCollectionFailure',

    // add/remove selected deck groups
    'ADD_SELECTED_COLLECTION': 'addSelectedCollection',
    'REMOVE_SELECTED_COLLECTION': 'removeSelectedCollection',

    //Group details modal
    'HIDE_GROUP_DETAILS_MODAL': 'hideGroupsDetailsModal'
>>>>>>> master
};

export default DeckEditStore;
