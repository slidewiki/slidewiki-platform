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

        // variables for error handling 
        this.loadCollectionsError = false;
        this.addCollectionError = false;
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
            showGroupModal: this.showGroupModal, 
            collectionOptions: this.collectionOptions,
            selectedCollections: this.selectedCollections,
            loadCollectionsError: this.loadCollectionsError, 
            addCollectionError: this.addCollectionError,
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
        this.collectionOptions = state.collectionOptions;
        this.selectedCollections = state.selectedCollections;
        this.loadCollectionsError = state.loadCollectionsError; 
        this.addCollectionError = state.addCollectionError;
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
        this.detailedGroup = group;
        this.showGroupModal = true;
        this.emitChange();
        this.showGroupModal = false;
    }

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

    addCollection(newCollection){
        this.collectionOptions.push(newCollection);
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
}

DeckEditStore.storeName = 'DeckEditStore';
DeckEditStore.handlers = {
    'LOAD_DECK_PROPS_SUCCESS': 'updateProperties',
    'UPDATE_AUTHORIZED_USERS': 'updateAuthorizedUsers',
    'UPDATE_AUTHORIZED_GROUPS': 'updateAuthorizedGroups',
    'UPDATE_DECKEDIT_VIEW_STATE': 'updateViewState',
    'DECKEDIT_LOAD_USERGROUP': 'loadUsergroup',
    'LOAD_DECK_PROPS_FAILURE': 'resetProperties', 

    // load user groups created by a specific user
    'LOAD_USER_COLLECTIONS_SUCCESS': 'loadUserCollections', 
    'LOAD_USER_COLLECTIONS_FAILURE': 'loadCollectionsFail', 

    // load deck groups assigned to a deck
    'LOAD_COLLECTIONS_SUCCESS': 'loadCollections', 
    'LOAD_COLLECTIONS_FAILURE': 'loadCollectionsFail',

    'ADD_COLLECTION_SUCCESS': 'addCollection', 
    'ADD_COLLECTION_FAILURE': 'addCollectionFailure', 

    // add/remove selected deck groups
    'ADD_SELECTED_COLLECTION': 'addSelectedCollection',
    'REMOVE_SELECTED_COLLECTION': 'removeSelectedCollection'
};

export default DeckEditStore;
