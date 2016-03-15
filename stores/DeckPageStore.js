import {BaseStore} from 'fluxible/addons';

class DeckPageStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.selector = {'id': 0, 'spath': '', 'sid': 0, 'stype': ''};
        this.page = 'deck';
        this.mode = 'view';
    }
    updateContent(payload) {
        this.selector= {'id': payload.params.id, 'spath': payload.params.spath, 'sid': payload.params.sid, 'stype': payload.params.stype};
        this.page = payload.page;
        this.mode = payload.params.mode;
        this.emitChange();
    }
    getState() {
        return {
            selector: this.selector,
            page: this.page,
            mode: this.mode
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.selector = state.selector;
        this.page = state.page;
        this.mode = state.mode;
    }
}

DeckPageStore.storeName = 'DeckPageStore';
DeckPageStore.handlers = {
    'UPDATE_DECK_PAGE_CONTENT': 'updateContent'
};

export default DeckPageStore;
