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
        this.deckGroupOptions = [];
        this.selectedDeckGroups = [];

        this.showGroupModal = false;
    }

    updateProperties(payload) {
        this.deckProps = payload.deckProps;
        this.editors = payload.editors;

        //edit rights adoptions
        this.authorizedUsers = JSON.parse(JSON.stringify(payload.deckProps.editors.users));
        this.authorizedGroups = JSON.parse(JSON.stringify(payload.deckProps.editors.groups));
        this.originalEditors = JSON.parse(JSON.stringify(payload.deckProps.editors));

        this.selectedDeckGroups = payload.deckGroups;
        // console.log('Now we have new origin editors:', this.originalEditors);

        this.emitChange();
    }

    resetProperties() {
        this.originalEditors = {
            users: [],
            groups: []
        };

        this.selectedDeckGroups = [];

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
            deckGroupOptions: this.deckGroupOptions,
            selectedDeckGroups: this.selectedDeckGroups,
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
        this.deckGroupOptions = state.deckGroupOptions;
        this.selectedDeckGroups = state.selectedDeckGroups;
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

    loadDeckGroups(payload){
        this.deckGroupOptions = payload.documents;
        this.emitChange();
    }

    loadDeckGroupsError(){
        // TODO
    }

    addDeckGroup(newGroup){
        this.deckGroupOptions.push(newGroup);
        // TODO: add new groups to selected

        this.emitChange();
    }

    addDeckGroupError(){
        // TODO
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

    'LOAD_DECK_GROUPS_SUCCESS': 'loadDeckGroups', 
    'LOAD_DECK_GROUPS_FAILURE': 'loadDeckGroupsError', 

    'ADD_DECK_GROUP_SUCCESS': 'addDeckGroup', 
    'ADD_DECK_GROUP_FAILURE': 'addDeckGroupError'
};

export default DeckEditStore;
