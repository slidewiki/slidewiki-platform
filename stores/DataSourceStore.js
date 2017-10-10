import {BaseStore} from 'fluxible/addons';

class DataSourceStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.dataSources = [];
        this.showAllDataSources = false;
        this.dataSource = undefined;
        this.selectedIndex = -1;
        this.selector = {};
    }
    loadDataSources(payload) {
        this.dataSources = payload.dataSources;
        this.dataSources.forEach((datasource) => {if (datasource._id) delete datasource._id;});//Remove _id attribute created for migrated decks
        this.selector = payload.selector;
        this.dataSource = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    updateDatasourcesFromSlideData(payload) {
        let lastRevision = payload.slide.revisions[payload.slide.revisions.length - 1];
        this.dataSources = lastRevision.dataSources ? lastRevision.dataSources : [];
        this.selector = payload.selector;
        this.dataSource = undefined;
        this.selectedIndex = -1;
        this.contentOwner = lastRevision.user;

        this.emitChange();
    }
    loadDataSource(payload) {
        this.dataSource = this.dataSources[payload.dsindex];
        this.selectedIndex = payload.dsindex;
        this.emitChange();
    }
    updateDataSources(payload) {
        this.dataSources = payload.dataSources;
        this.dataSource = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    newDataSource() {
        this.dataSource = null;
        this.emitChange();
    }
    cancelEditDataSource() {
        this.dataSource = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    handleShowAllDataSources() {
        this.showAllDataSources = true;
        this.emitChange();
    }
    getState() {
        return {
            dataSources: this.dataSources,
            showAllDataSources: this.showAllDataSources,
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
        this.showAllDataSources = state.showAllDataSources;
        this.dataSource = state.dataSource;
        this.selectedIndex = state.selectedIndex;
        this.selector = state.selector;
    }
}

DataSourceStore.storeName = 'DataSourceStore';
DataSourceStore.handlers = {
    'LOAD_DATASOURCES_SUCCESS': 'loadDataSources',
    'LOAD_SLIDE_CONTENT_SUCCESS': 'updateDatasourcesFromSlideData',
    'LOAD_DATASOURCE': 'loadDataSource',
    'NEW_DATASOURCE': 'newDataSource',
    'SHOW_ALL_DATASOURCES': 'handleShowAllDataSources',
    'UPDATE_DATASOURCES_SUCCESS': 'updateDataSources',
    'CANCEL_EDIT_DATASOURCE': 'cancelEditDataSource'
};

export default DataSourceStore;
