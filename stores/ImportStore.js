import {BaseStore} from 'fluxible/addons';

class ImportStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.resultMessage = '';
        this.isUploaded = false;
        this.file = null;
        this.base64 = null;
        this.filename = '';
    }
    destructor()
    {
        this.resultMessage = '';
        this.isUploaded = false;
        this.file = null;
        this.base64 = null;
        this.filename = '';
    }
    getState() {
        return {
            resultMessage: this.resultMessage,
            isUploaded: this.isUploaded,
            file: this.file,
            base64: this.base64,
            filename: this.filename
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.resultMessage = state.resultMessage;
        this.isUploaded = state.isUploaded;
        this.file = state.file;
        this.base64 = state.base64;
        this.filename = state.filename;
    }

    storeFile(payload) {
        console.log('ImportStore: storeFile()', payload);
        this.file = payload.file;
        this.base64 = payload.base64;
        this.filename = this.file.name;
        this.emitChange();
    }
    uploadFailed(error) {
        //TODO: show an error
    }
    uploadSuccess(headers) {
        this.isUploaded = true;
        this.resultMessage = 'You presentation was uploaded to our servers. In a moment you will be redirected to it.';
        this.emitChange();
    }
}

ImportStore.storeName = 'ImportStore';
ImportStore.handlers = {
    'STORE_FILE': 'storeFile',
    'IMPORT_FINISHED': 'destructor',
    'UPLOAD_FAILED': 'uploadFailed',
    'UPLOAD_SUCCESS': 'uploadSuccess'
};

export default ImportStore;
