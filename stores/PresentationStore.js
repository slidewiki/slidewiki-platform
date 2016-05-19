import {BaseStore} from 'fluxible/addons';

class PresentationStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.selector = {'id': 0, 'spath': '', 'sid': 0, 'stype': '', page: 'contentmode'};
        this.mode = 'view';
        //this.dispatcher = dispatcher; // Provides access to waitFor and getStore methods
        this.items = {dataSources : {'count' : 0}, questions : {'count' : 0}};
    }

    getState() {
        return {
            items: this.items,
            selector: this.selector,
            mode: this.mode

        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.items = state.items;
        this.selector = state.selector;
        this.mode = state.mode;
    }
}

PresentationStore.storeName = 'TabLinksStore';
PresentationStore.handlers = {
    'LOAD_PRESENTATION_SUCCESS': 'updatePresentation'
};

export default PresentationStore;
