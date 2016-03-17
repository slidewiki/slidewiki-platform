import {BaseStore} from 'fluxible/addons';

class DeckPageStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.selector = {'id': 0, 'spath': '', 'sid': 0, 'stype': ''};
        this.page = 'deck';
        this.mode = 'view';
        this.componentsStatus = {'TranslationPanel': {visible: 1, size: 4}, 'NavigationPanel': {visible: 1, size: 12}, 'TreePanel': {visible: 1, size: 4}, 'ContributorsPanel': {visible: 1, size: 4}, 'SimilarContentPanel': {visible: 1, size: 4}, 'ContentPanel': {visible: 1, size: 12}, 'ActivityFeedPanel': {visible: 1, size: 12}};
    }
    updateContent(payload) {
        this.selector= {'id': payload.params.id, 'spath': payload.params.spath, 'sid': payload.params.sid, 'stype': payload.params.stype};
        this.page = payload.page;
        this.mode = payload.params.mode;
        this.emitChange();
    }
    restoreAll() {
        this.componentsStatus = {'TranslationPanel': {visible: 1, size: 4}, 'NavigationPanel': {visible: 1, size: 12}, 'TreePanel': {visible: 1, size: 4}, 'ContributorsPanel': {visible: 1, size: 4}, 'SimilarContentPanel': {visible: 1, size: 4}, 'ContentPanel': {visible: 1, size: 12}, 'ActivityFeedPanel': {visible: 1, size: 12}};
        this.emitChange();
    }
    expandContentPanel() {
        //hide all others than Navigation and Content
        for(let c in this.componentsStatus){
            if(c=== 'NavigationPanel' || c=== 'ContentPanel') {
                this.componentsStatus[c].visible=1;
                this.componentsStatus[c].size=16;
            }else{
                this.componentsStatus[c].visible=0;
            }
        }
        this.emitChange();
    }
    getState() {
        return {
            selector: this.selector,
            page: this.page,
            mode: this.mode,
            componentsStatus: this.componentsStatus
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.selector = state.selector;
        this.page = state.page;
        this.mode = state.mode;
        this.componentsStatus = state.componentsStatus;
    }
}

DeckPageStore.storeName = 'DeckPageStore';
DeckPageStore.handlers = {
    'UPDATE_DECK_PAGE_CONTENT': 'updateContent',
    'EXPAND_CONTENET_PANEL': 'expandContentPanel',
    'RESTORE_DECK_PAGE_LAYOUT': 'restoreAll'
};

export default DeckPageStore;
