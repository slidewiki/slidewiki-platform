import {BaseStore} from 'fluxible/addons';

class DataSourceStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.datasources = [];
        this.selector = {};
    }
    updateDataSources(payload) {
        this.datasources = payload.datasources;
        this.selector = payload.selector;
        this.emitChange();
    }
    getState() {
        return {
            datasources: this.datasources,
            selector: this.selector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.datasources = state.datasources;
        this.selector = state.selector;
    }
}

DataSourceStore.storeName = 'DataSourceStore';
DataSourceStore.handlers = {
    'LOAD_DATASOURCES_SUCCESS': 'updateDataSources'
};

export default DataSourceStore;
