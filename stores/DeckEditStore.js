import {BaseStore} from 'fluxible/addons';

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
        this.permissions = {
            fork: false,
            edit: false,
            admin: false
        };
        this.originalEditors = {
            users: [],
            groups: []
        };
    }

    updateProperties(payload) {
        this.deckProps = payload.deckProps;
        this.editors = payload.editors;
        this.permissions = payload.permissions;

        //edit rights adoptions
        this.authorizedUsers = payload.deckProps.editors.users;
        this.authorizedGroups = payload.deckProps.editors.groups;
        this.originalEditors = payload.deckProps.editors;

        this.emitChange();
    }

    resetProperties() {
        this.permissions = {
            fork: false,
            edit: false,
            admin: false
        };
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
            permissions: this.permissions,
            originalEditors: this.originalEditors
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
        this.permissions = state.permissions;
        this.originalEditors = state.originalEditors;
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
}

DeckEditStore.storeName = 'DeckEditStore';
DeckEditStore.handlers = {
    'LOAD_DECK_PROPS_SUCCESS': 'updateProperties',
    'UPDATE_AUTHORIZED_USERS': 'updateAuthorizedUsers',
    'UPDATE_AUTHORIZED_GROUPS': 'updateAuthorizedGroups',
    'UPDATE_DECKEDIT_VIEW_STATE': 'updateViewState',
    'DECKEDIT_LOAD_USERGROUP': 'loadUsergroup',
    'UPDATE_NEEDS_NEW_REVISION': 'updateNeedsNewRevision',
    'LOAD_DECK_PROPS_FAILURE': 'resetProperties'
};

export default DeckEditStore;
