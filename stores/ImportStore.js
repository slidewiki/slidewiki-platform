import {BaseStore} from 'fluxible/addons';

class ImportStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.isUploaded = false;
        this.file = null;
        this.base64 = null;
        this.filename = '';
        this.uploadProgress = 0;
        this.fileReadyForUpload = false;
        this.deckId = null;
        this.error = null;
    }
    destructor()
    {
        this.isUploaded = false;
        this.file = null;
        this.base64 = null;
        this.filename = '';
        this.uploadProgress = 0;
        this.fileReadyForUpload = false;
        this.deckId = null;
        this.error = null;
    }
    getState() {
        return {
            isUploaded: this.isUploaded,
            file: this.file,
            base64: this.base64,
            filename: this.filename,
            fileReadyForUpload: this.fileReadyForUpload,
            uploadProgress: this.uploadProgress,
            deckId: this.deckId,
            error: this.error
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.isUploaded = state.isUploaded;
        this.file = state.file;
        this.base64 = state.base64;
        this.filename = state.filename;
        this.fileReadyForUpload = state.fileReadyForUpload;
        this.uploadProgress = state.uploadProgress;
        this.deckId = state.deckId;
        this.error = state.error;
    }

    storeFile(payload) {
        console.log('ImportStore: storeFile()', payload);
        this.file = payload.file;
        this.base64 = payload.base64;
        this.filename = this.file.name;
        this.fileReadyForUpload = true;
        this.emitChange();
    }
    uploadFailed(error) {
        console.log('ImportStore: uploadFailed()', error);
        this.destructor();

        this.error = error;

        this.file = null;
        this.base64 = null;
        this.filename = '';
        this.fileReadyForUpload = false;

        this.emitChange();
    }
    uploadSuccess(headers) {
        console.log('ImportStore: uploadSuccess()', headers);
        this.isUploaded = true;
        this.uploadProgress = 100;
        this.deckId = headers.deckid;

        this.file = null;
        this.base64 = null;
        this.fileReadyForUpload = false;

        this.emitChange();
    }
    uploadStarted() {
        console.log('ImportStore: uploadStarted()');
        this.uploadProgress = 10;
        this.error = null;
        this.emitChange();
    }
    uploadMoreProgress(progress) {
        console.log('ImportStore: uploadMoreProgress()', progress);
        if (this.uploadProgress === 100)
            return;

        this.uploadProgress += progress;

        if (this.uploadProgress > 99)
            this.uploadProgress = 99;

        this.emitChange();
    }
}

ImportStore.storeName = 'ImportStore';
ImportStore.handlers = {
    'STORE_FILE': 'storeFile',
    'IMPORT_FINISHED': 'destructor',
    'UPLOAD_FAILED': 'uploadFailed',
    'UPLOAD_SUCCESS': 'uploadSuccess',
    'UPLOAD_STARTED': 'uploadStarted',
    'UPLOAD_MORE_PROGRESS': 'uploadMoreProgress'
};

export default ImportStore;
