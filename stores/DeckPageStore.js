import {BaseStore} from 'fluxible/addons';

class DeckPageStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.selector = {'id': 0, 'spath': '', 'sid': 0, 'stype': ''};
        this.deckSlug = '_';
        this.page = 'deck';
        this.mode = 'view';
        this.componentsStatus = {
            'NavigationPanel': {visible: 1, columnSize: 16},
            'TreePanel': {visible: 1, columnSize: 3},
            'SlideEditLeftPanel': {visible: 1, columnSize: 3},
            'ActivityFeedPanel': {visible: 1, columnSize: 3},
            'ContentPanel': {visible: 1, columnSize: 10},
            'ContentModulesPanel': {visible: 1, columnSize: 10},
            'contentAndRightPanel': {visible: 1, columnSize: 13},
            'contentAndRightModulesPanel': {visible: 1, columnSize: 13}};
    }
    updateContent(payload) {
        this.selector= {'id': payload.params.id, 'spath': payload.params.spath, 'sid': payload.params.sid, 'stype': payload.params.stype};
        this.deckSlug = (payload.params.slug || '/_').substring(1);
        this.page = payload.page;
        this.mode = payload.params.mode;
        this.emitChange();
    }
    restoreAll() {
        this.componentsStatus = {'NavigationPanel': {visible: 1, columnSize: 16}, 'TreePanel': {visible: 1, columnSize: 3}, 'SlideEditLeftPanel': {visible: 1, columnSize: 3}, 'ActivityFeedPanel': {visible: 1, columnSize: 3}, 'ContentPanel': {visible: 1, columnSize: 10}, 'ContentModulesPanel': {visible: 1, columnSize: 10}};
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
    showSlideEditLeftPanel() {
        //hide all others than Navigation and Content
        for(let c in this.componentsStatus){
            if(c=== 'NavigationPanel') {
                //this.componentsStatus[c].visible=0;
                this.componentsStatus[c].visible=1;
                this.componentsStatus[c].columnSize=16;
            }else if(c=== 'SlideEditLeftPanel'){
                this.componentsStatus[c].visible=1;
                this.componentsStatus[c].columnSize=3;
            }else if(c=== 'ContentPanel'){
                this.componentsStatus[c].visible=1;
                this.componentsStatus[c].columnSize=10;
            }else if(c=== 'ActivityFeedPanel'){
                this.componentsStatus[c].visible=0;
                this.componentsStatus[c].visible=1;
                this.componentsStatus[c].columnSize=3;
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
            deckSlug: this.deckSlug,
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
        this.deckSlug = state.deckSlug;
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
    'RESTORE_DECK_PAGE_LAYOUT': 'restoreAll',
    'SHOW_SLIDE_EDIT_PANEL': 'showSlideEditLeftPanel'
};

export default DeckPageStore;
