import {BaseStore} from 'fluxible/addons';

class DataSourceStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.datasources = [];
        this.datasource = undefined;
        this.selectedIndex = -1;
        this.selector = {};
    }
    loadDataSources(payload) {
        this.datasources = payload.datasources;
        this.selector = payload.selector;
        this.datasource = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    loadDataSource(payload) {
        this.datasource = this.datasources[payload.dsindex];
        this.selectedIndex = payload.dsindex;
        this.emitChange();
    }
    saveDataSource(payload) {
        this.datasources[this.selectedIndex] = payload.datasource;
        this.datasource = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    newDataSource(payload) {
        this.datasource = null;
        this.emitChange();
    }
    addDataSource(payload) {
        this.datasources.push(payload.datasource);
        this.datasource = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    cancelEditDataSource(payload) {
        this.datasource = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    getState() {
        return {
            datasources: this.datasources,
            datasource: this.datasource,
            selectedIndex: this.selectedIndex,
            selector: this.selector,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.datasources = state.datasources;
        this.datasource = state.datasource;
        this.selectedIndex = state.selectedIndex;
        this.selector = state.selector;
    }
}

DataSourceStore.storeName = 'DataSourceStore';
DataSourceStore.handlers = {
    'LOAD_DATASOURCES_SUCCESS': 'loadDataSources',
    'LOAD_DATASOURCE': 'loadDataSource',
    'NEW_DATASOURCE': 'newDataSource',
    'ADD_DATASOURCE_SUCCESS': 'addDataSource',
    'SAVE_DATASOURCE_SUCCESS': 'saveDataSource',
    'CANCEL_EDIT_DATASOURCE': 'cancelEditDataSource'
};

export default DataSourceStore;
