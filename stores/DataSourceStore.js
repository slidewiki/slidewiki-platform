import {BaseStore} from 'fluxible/addons';

class DataSourceStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.datasources = [];
    }
    updateDataSources(payload) {
        this.datasources = payload.datasources;
        this.emitChange();
    }
    getState() {
        return {
            datasources: this.datasources
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.datasources = state.datasources;
    }
}

DataSourceStore.storeName = 'DataSourceStore';
DataSourceStore.handlers = {
    'LOAD_DATASOURCES_SUCCESS': 'updateDataSources'
};

export default DataSourceStore;
