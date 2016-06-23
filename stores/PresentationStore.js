import {BaseStore} from 'fluxible/addons';

class PresentationStore extends BaseStore {

    constructor(dispatcher) {
        console.log('In PresentationStore');
        super(dispatcher);
        this.content = '';

    }
    updatePresentation(payload) {
        this.content = payload.content;
        this.emitChange();
        //console.log("Updating content", payload.content);
    }

    getState() {
        return {
            items: this.items,
            selector: this.selector,
            mode: this.mode,
            content: this.content

        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.items = state.items;
        this.selector = state.selector;
        this.mode = state.mode;
        this.content = state.content;
    }
}

PresentationStore.storeName = 'PresentationStore';
PresentationStore.handlers = {
    'LOAD_PRESENTATION_SUCCESS': 'updatePresentation'
};

export default PresentationStore;
