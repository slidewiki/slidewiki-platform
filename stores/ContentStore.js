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
            'subdeck': this.getCurrentSubdeck()
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
        this.selector.currentSubDeck = selector.currentSubDeck;
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
    getCurrentSubdeck(){
        let selector = this.selector;
        console.log('selector', selector);
        let currentSubDeck;
        let splitSpath = selector.spath.split(';');
        console.log('stype: ', selector.stype);
        if(selector.spath === ''){
            return selector.id;
        }
        else if(selector.stype === 'deck' && selector.spath){
            console.log('spath ', selector.spath);
            currentSubDeck = splitSpath[splitSpath.length - 1].split(':')[0];
            // console.log('length: ', currentSubDeck.length);
            console.log('currentSubDeck: ', currentSubDeck);
        }
        else if(selector.stype === 'slide' && selector.spath){
            // Since the last one in the list will be the slide ID, we use -2
            currentSubDeck = splitSpath[splitSpath.length - 2].split(':')[0];
        }
        return currentSubDeck;

    }

}

ContentStore.storeName = 'ContentStore';
ContentStore.handlers = {
    'UPDATE_CONTENT': 'updateContent',
    'UPDATE_CONTENT_SELECTOR': 'updateSelector'
};

export default ContentStore;
