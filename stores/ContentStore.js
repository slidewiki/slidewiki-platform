import {BaseStore} from 'fluxible/addons';

class ContentStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.selector = {'id': 0, 'subdeck': 0, 'spath': '', 'sid': 0, 'stype': '', page: 'content', 'theme': 'white'};
        this.mode = 'view';
    }
    updateContent(payload) {
        this.selector= {
            'id': payload.params.id,
            'spath': payload.params.spath,
            'sid': payload.params.sid,
            'stype': payload.params.stype,
            'page': payload.page,
            'theme': payload.params.theme,
            'subdeck': this.getCurrentSubdeck({'id': payload.params.id, 'spath': payload.params.spath, 'stype': payload.params.stype})
        };
        this.mode = payload.params.mode;
        this.emitChange();
    }
    updateSelector(selector) {
        this.selector.id = selector.id;
        this.selector.spath = selector.spath;
        this.selector.sid = selector.sid;
        this.selector.stype = selector.stype;
        this.selector.theme = selector.theme;
        this.selector.currentSubDeck = this.getCurrentSubdeck();
        this.emitChange();
    }
    getState() {
        return {
            selector: this.selector,
            mode: this.mode,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.selector = state.selector;
        this.mode = state.mode;
    }
    getCurrentSubdeck(selector){
        let currentSubDeck;
        let splitSpath = selector.spath.split(';');

        if(!selector.spath || (splitSpath.length === 1 && selector.stype === 'slide')){
            return null;
        }
        else if(selector.stype === 'deck' && selector.sid){
            return selector.sid;
        }
        else{
            return splitSpath[0].split(':')[0];
        }
    }

}

ContentStore.storeName = 'ContentStore';
ContentStore.handlers = {
    'UPDATE_CONTENT': 'updateContent',
    'UPDATE_CONTENT_SELECTOR': 'updateSelector'
};

export default ContentStore;
