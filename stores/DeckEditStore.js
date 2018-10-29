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

        this.showGroupModal = false;

        this.queryParams = {};

        this.roots = [];
    }

    updateProperties(payload) {
        this.deckProps = payload.deckProps;
        this.editors = payload.editors;

        //edit rights adoptions
        this.authorizedUsers = JSON.parse(JSON.stringify(payload.deckProps.editors.users));
        this.authorizedGroups = JSON.parse(JSON.stringify(payload.deckProps.editors.groups));
        this.originalEditors = JSON.parse(JSON.stringify(payload.deckProps.editors));
        // console.log('Now we have new origin editors:', this.originalEditors);

        this.roots = payload.roots.filter((deck) => parseInt(deck.id, 10) !== parseInt(this.deckProps.sid.split('-')[0], 10));
        // console.log('DeckEditStore roots', payload.roots, this.roots, this.deckProps.sid, this.deckProps.sid.split('-')[0]);

        this.emitChange();
    }

    resetProperties() {
        this.originalEditors = {
            users: [],
            groups: []
        };

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
            queryParams: this.queryParams,
            showGroupModal: this.showGroupModal,
            roots: this.roots,
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
        this.queryParams = state.queryParams;
        this.roots = state.roots;
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

    setQueryParams(params) {
        this.queryParams = params;
        this.emitChange();
    }

    hideGroupsDetailsModal() {
        this.showGroupModal = false;
        this.emitChange();
    }

    deleteDeckError(error) {
        this.viewstate = 'errorDelete';
        this.emitChange();
        this.viewstate = '';
    }

    deleteDeck(data) {
        this.viewstate = 'successDelete';
        this.emitChange();
        this.viewstate = '';
    }

    startDeleteDeck() {
        this.viewstate = 'loading';
        this.emitChange();
        this.viewstate = '';
    }

    removeDeckError(error) {
        this.viewstate = 'errorRemove';
        this.emitChange();
        this.viewstate = '';
    }

    removeDeck(data) {
        this.viewstate = 'successRemove';
        this.emitChange();
        this.viewstate = '';
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
    'DECKEDIT_START_QUERY_PARAMS': 'setQueryParams',

    //Group details modal
    'HIDE_GROUP_DETAILS_MODAL': 'hideGroupsDetailsModal',

    // Deck deletion/removable
    'DELETE_DECK_ERROR': 'deleteDeckError',
    'DELETE_DECK_SUCCESS': 'deleteDeck',
    'START_DELETE_DECK': 'startDeleteDeck',
    'REMOVE_DECK_ERROR': 'removeDeckError',
    'REMOVE_DECK_SUCCESS': 'removeDeck'
};

export default DeckEditStore;
