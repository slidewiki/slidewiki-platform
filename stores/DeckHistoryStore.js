import {BaseStore} from 'fluxible/addons';

class DeckHistoryStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.revisions = [];
        this.changes = {};
    }
    loadDeckRevisions(payload) {
        this.revisions = payload.revisions;
        if (this.revisions.length > 0){
            this.revisions[0].latest = true;
        }
        this.changes = {};
        this.emitChange();
    }

    loadDeckChanges(payload) {
        this.changes[payload.revisionId] = payload.changes;
        this.emitChange();
    }

    showRevisionChanges(payload) {
        let revision = this.revisions.find((rev) => rev.id === payload.revisionId);
        if (revision){
            revision.expanded = true;
        }
        this.emitChange();
    }

    hideRevisionChanges(payload) {
        let revision = this.revisions.find((rev) => rev.id === payload.revisionId);
        if (revision){
            revision.expanded = false;
        }
        this.emitChange();
    }

    getState() {
        return {
            revisions: this.revisions,
            changes: this.changes
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.revisions = state.revisions;
        this.changes = state.changes;
    }
}

DeckHistoryStore.storeName = 'DeckHistoryStore';
DeckHistoryStore.handlers = {
    'LOAD_DECK_REVISIONS_SUCCESS': 'loadDeckRevisions',
    'LOAD_DECK_CHANGES_SUCCESS': 'loadDeckChanges',
    'SHOW_REVISION_CHANGES': 'showRevisionChanges',
    'HIDE_REVISION_CHANGES': 'hideRevisionChanges'

};

export default DeckHistoryStore;
