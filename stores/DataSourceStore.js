import {BaseStore} from 'fluxible/addons';

class DataSourceStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.datasources = [];
    }
    updateContributors(payload) {
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
    'LOAD_DATASOURCE_SUCCESS': 'updateDataSources'
};

export default DataSourceStore;
