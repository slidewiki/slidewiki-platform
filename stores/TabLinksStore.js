import {BaseStore} from 'fluxible/addons';

class TabLinksStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.selector = {'id': 0, 'spath': '', 'sid': 0, 'stype': '', page: 'contentmode'};
        this.mode = 'view';
        //this.dispatcher = dispatcher; // Provides access to waitFor and getStore methods
        this.items = {dataSources : {'count' : 0}};
    }
    updateDataSourceCount(payload) {
      console.log(payload);
        this.items.dataSources.count = payload.count;
        this.mode = payload.mode;
        this.selector = payload.selector;
        this.emitChange();
    }

    updateContentMode(payload) {
      this.mode = payload.mode;
      this.emitChange();
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

TabLinksStore.storeName = 'TabLinksStore';
TabLinksStore.handlers = {
    'LOAD_AMOUNT_OF_DATA_SOURCES_SUCCESS': 'updateDataSourceCount',
    'UPDATE_CONTENT_MODE': 'updateContentMode'

};

export default TabLinksStore;
