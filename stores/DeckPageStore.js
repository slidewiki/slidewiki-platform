import {BaseStore} from 'fluxible/addons';

class DeckPageStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.selector = {'id': 0, 'spath': '', 'sid': 0, 'stype': ''};
        this.page = 'deck';
        this.mode = 'view';
        this.componentsStatus = {'NavigationPanel': {visible: 1, columnSize: 16},
                                 'TreePanel': {visible: 1, columnSize: 4},
                                 'ActivityFeedPanel': {visible: 1, columnSize: 4},
                                 'ContentPanel': {visible: 1, columnSize: 12},
                                 'ContentModulesPanel': {visible: 1, columnSize: 12}};
    }
    updateContent(payload) {
        this.selector= {'id': payload.params.id, 'spath': payload.params.spath, 'sid': payload.params.sid, 'stype': payload.params.stype};
        this.page = payload.page;
        this.mode = payload.params.mode;
        this.emitChange();
    }
    restoreAll() {
        this.componentsStatus = {'NavigationPanel': {visible: 1, columnSize: 16}, 'TreePanel': {visible: 1, columnSize: 4}, 'ActivityFeedPanel': {visible: 1, columnSize: 4}, 'ContentPanel': {visible: 1, columnSize: 12}, 'ContentModulesPanel': {visible: 1, columnSize: 12}};
        this.emitChange();
    }
    expandContentPanel() {
        //hide all others than Navigation and Content
        for(let c in this.componentsStatus){
            if(c=== 'NavigationPanel' || c=== 'ContentPanel') {
                this.componentsStatus[c].visible=1;
                this.componentsStatus[c].columnSize=16;
            }else{
                this.componentsStatus[c].visible=0;
            }
        }
        this.emitChange();
    }
    hideLeftColumn() {
        //hide all others than Navigation and Content
        for(let c in this.componentsStatus){
            if(c=== 'ContentModulesPanel' || c=== 'ContentPanel' || c=== 'NavigationPanel') {
                this.componentsStatus[c].visible=1;
                this.componentsStatus[c].columnSize=16;
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
    'HIDE_LEFT_COLUMN': 'hideLeftColumn',
    'RESTORE_DECK_PAGE_LAYOUT': 'restoreAll'
};

export default DeckPageStore;
