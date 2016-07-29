import {BaseStore} from 'fluxible/addons';

class ImportStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.content = '';
        this.isUploaded = false;
        this.isAllowed = false;
        this.HTMLoutput = '';
        this.file;
    }
    destructor()
    {
        this.content = '';
        this.isUploaded = false;
        this.isAllowed = false;
        this.HTMLoutput = '';
        this.file;
    }
    showImportFile(payload) {
        //this.content = payload.content;
        this.content = payload.file;
        //console.log('imported HTML given back by importservice:' + payload.htmlConvert);
        //this.isUploaded = true;
        //this.emitChange();
    }
    importFrontend(payload) {
        //this.content = payload.content;
        this.HTMLoutput = payload.HTMLoutput;
        console.log('imported HTML given back by importservice:' + payload.HTMLoutput);
        //this.isUploaded = true;
        //this.emitChange();
    }
    checkFile(payload) {
        this.file = payload.file;
        //console.log('teststore' + this.file);
        //TODO: add logic in services/import or actions/importFileSelect.js to check if file is valid, based on file extension, content size, encoding, etc..
        this.isAllowed = true;
        //this.isUploaded = true;
        this.emitChange();
    }
    getState() {
        return {
            content: this.content,
            isUploaded: this.isUploaded,
            isAllowed: this.isAllowed,
            htmlConvert: this.HTMLoutput,
            file: this.file
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.content = state.content;
        this.isUploaded = state.isUploaded;
        this.isAllowed = state.isAllowed;
        this.HTMLoutput = state.HTMLoutput;
        this.file = state.file;
    }
}

ImportStore.storeName = 'ImportStore';
ImportStore.handlers = {
    'LOAD_IMPORT_FILE_SUCCESS': 'showImportFile',
    'IMPORT_FILE_SELECT': 'checkFile',
    'IMPORT_FINISHED': 'destructor',
    'IMPORT_FRONTEND_SUCCESS': 'importFrontend'
};

export default ImportStore;
