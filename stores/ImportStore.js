import {BaseStore} from 'fluxible/addons';

class ImportStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.content = '';
        this.isUploaded = false;
        this.isAllowed = false;
    }
    destructor()
    {
        this.content = '';
        this.isUploaded = false;
        this.isAllowed = false;
    }
    showImportFile(payload) {
        this.content = payload.content;
        this.isUploaded = true;
        this.emitChange();
    }
    checkFile(payload) {
        //TODO: add logic in services/import or actions/importFileSelect.js to check if file is valid, based on file extension, content size, encoding, etc..
        this.isAllowed = true;
        //this.isUploaded = true;
        this.emitChange();
    }
    getState() {
        return {
            content: this.content,
            isUploaded: this.isUploaded,
            isAllowed: this.isAllowed
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.content = state.content;
        this.isUploaded = state.isUploaded;
        this.isAllowed = state.isAllowed;
    }
}

ImportStore.storeName = 'ImportStore';
ImportStore.handlers = {
    'LOAD_IMPORT_FILE_SUCCESS': 'showImportFile',
    'IMPORT_FILE_SELECT': 'checkFile',
    'IMPORT_FINISHED': 'destructor'
};

export default ImportStore;
