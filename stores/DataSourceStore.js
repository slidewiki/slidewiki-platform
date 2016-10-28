import {BaseStore} from 'fluxible/addons';

class DataSourceStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.dataSources = [];
        this.dataSource = undefined;
        this.selectedIndex = -1;
        this.selector = {};
    }
    loadDataSources(payload) {
        this.dataSources = payload.datasources;
        this.selector = payload.selector;
        this.dataSource = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    loadDataSource(payload) {
        this.dataSource = this.dataSources[payload.dsindex];
        this.selectedIndex = payload.dsindex;
        this.emitChange();
    }
    saveDataSources(payload) {
        this.dataSources = payload.datasources;
        this.dataSource = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    newDataSource(payload) {
        this.dataSource = null;
        this.emitChange();
    }
    cancelEditDataSource(payload) {
        this.dataSource = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    getState() {
        return {
            dataSources: this.dataSources,
            dataSource: this.dataSource,
            selectedIndex: this.selectedIndex,
            selector: this.selector,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.dataSources = state.dataSources;
        this.dataSource = state.dataSource;
        this.selectedIndex = state.selectedIndex;
        this.selector = state.selector;
    }
}

DataSourceStore.storeName = 'DataSourceStore';
DataSourceStore.handlers = {
    'LOAD_DATASOURCES_SUCCESS': 'loadDataSources',
    'LOAD_DATASOURCE': 'loadDataSource',
    'NEW_DATASOURCE': 'newDataSource',
    'SAVE_DATASOURCES_SUCCESS': 'saveDataSources',
    'CANCEL_EDIT_DATASOURCE': 'cancelEditDataSource'
};

export default DataSourceStore;
