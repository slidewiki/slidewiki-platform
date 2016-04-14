import {BaseStore} from 'fluxible/addons';

class ImportStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.content = '';
        this.isUploaded = false;
    }
    showImportFile(payload) {
        this.content = payload.content;
        this.isUploaded = true;
        this.emitChange();
    }
    getState() {
        return {
            content: this.content,
            isUploaded: this.isUploaded
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.content = state.content;
        this.isUploaded = state.isUploaded;
    }
}

ImportStore.storeName = 'ImportStore';
ImportStore.handlers = {
    'LOAD_IMPORT_FILE_SUCCESS': 'showImportFile'
};

export default ImportStore;
