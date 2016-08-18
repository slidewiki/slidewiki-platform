import {BaseStore} from 'fluxible/addons';

class DataSourceStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.datasources = [];
        this.datasource = null;
        this.selector = {};
    }
    loadDataSources(payload) {
        this.datasources = payload.datasources;
        this.selector = payload.selector;
        this.datasource = null;
        this.emitChange();
    }
    loadDataSource(payload) {
        this.datasource = this.datasources.find((ds) => ds.id === payload.dsid);
        this.emitChange();
    }
    saveDataSource(payload) {
        const index = this.datasources.findIndex((ds) => ds.id === payload.datasource.id);
        this.datasources[index] = payload.datasource;
        this.datasource = null;
        this.emitChange();
    }
    cancelEditDataSource(payload) {
        this.datasource = null;
        this.emitChange();
    }
    getState() {
        return {
            datasources: this.datasources,
            datasource: this.datasource,
            selector: this.selector,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.datasources = state.datasources;
        this.datasource = state.datasource;
        this.selector = state.selector;
    }
}

DataSourceStore.storeName = 'DataSourceStore';
DataSourceStore.handlers = {
    'LOAD_DATASOURCES_SUCCESS': 'loadDataSources',
    'LOAD_DATASOURCE': 'loadDataSource',
    'SAVE_DATASOURCE_SUCCESS': 'saveDataSource',
    'CANCEL_EDIT_DATASOURCE': 'cancelEditDataSource'
};

export default DataSourceStore;
