import {BaseStore} from 'fluxible/addons';

class DeckEditStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckProps = {};
        this.editors = [];
        this.selector = {};
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
        this.allowedToEditTheDeck = true;
    }

    updateProperties(payload) {
        this.deckProps = payload.deckProps;
        this.editors = payload.editors;
        this.selector = payload.selector;

        //accessLevel adoptions
        this.authorizedUsers = payload.deckProps.editors.users;
        this.authorizedGroups = payload.deckProps.editors.groups;

        //reset value
        this.allowedToEditTheDeck = true;

        this.emitChange();
    }

    getState() {
        return {
            deckProps: this.deckProps,
            editors: this.editors,
            selector: this.selector,
            authorizedUsers: this.authorizedUsers,
            authorizedGroups: this.authorizedGroups,
            viewstate: this.viewstate,
            detailedGroup: this.detailedGroup,
            allowedToEditTheDeck: this.allowedToEditTheDeck
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.deckProps = state.deckProps;
        this.editors = state.editors;
        this.selector = state.selector;
        this.authorizedUsers = state.authorizedUsers;
        this.viewstate = state.viewstate;
        this.authorizedGroups = state.authorizedGroups;
        this.detailedGroup = state.detailedGroup;
        this.allowedToEditTheDeck = state.allowedToEditTheDeck;
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
        this.emitChange();
    }

    editDeckNotAllowed() {
        this.allowedToEditTheDeck = false;
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
    'EDIT_DECK_NOT_ALLOWED': 'editDeckNotAllowed'
};

export default DeckEditStore;
