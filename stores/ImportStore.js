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
        this.noOfSlides = 0;
        this.totalNoOfSlides = 0;
        this.safetyCounter = 0;
        this.slides = [];
        this.title = '';
        this.language = '';
        this.description = '';
        this.theme = '';
        this.license = '';
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
        this.noOfSlides = 0;
        this.totalNoOfSlides = 0;
        this.safetyCounter = 0;
        this.slides = [];
        this.title = '';
        this.language = '';
        this.description = '';
        this.theme = '';
        this.license = '';
    }
    cancel() {
        this.destructor();
        this.emitChange();
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
            error: this.error,
            noOfSlides: this.noOfSlides,
            totalNoOfSlides: this.totalNoOfSlides,
            safetyCounter: this.safetyCounter,
            slides: this.slides,
            title: this.title,
            language: this.language,
            description: this.description,
            theme: this.theme,
            license: this.license
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
        this.noOfSlides = state.noOfSlides;
        this.totalNoOfSlides = state.totalNoOfSlides;
        this.safetyCounter = state.safetyCounter;
        this.slides = state.slides;
        this.title = state.title;
        this.language = state.language;
        this.description = state.description;
        this.theme = state.theme;
        this.license = state.license;
    }

    storeFile(payload) {
        // console.log('ImportStore: storeFile()', payload);
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
    uploadSuccess(data) {
        let headers = data.headers;
        let payload = data.payload;
        // console.log('ImportStore: uploadSuccess()', headers);
        this.isUploaded = true;
        // this.uploadProgress = 100;
        // this.uploadProgress = 65;
        this.deckId = headers.deckid;
        this.totalNoOfSlides = parseInt(headers.noofslides);

        this.title = payload.title;
        this.language = payload.language;
        this.description = payload.description;
        this.theme = payload.theme;
        this.license = payload.license;

        this.file = null;
        this.base64 = null;
        this.fileReadyForUpload = false;

        this.emitChange();
    }
    uploadStarted() {
        // console.log('ImportStore: uploadStarted()');
        this.uploadProgress = 10;
        this.error = null;
        this.noOfSlides = 0;
        this.totalNoOfSlides = 0;
        this.safetyCounter = 0;
        this.slides = [];
        this.emitChange();
    }
    uploadMoreProgress(progress) {
        // console.log('ImportStore: uploadMoreProgress()', progress);
        if (this.uploadProgress === 100)
            return;

        this.uploadProgress += progress;

        if (this.uploadProgress > 99)
            this.uploadProgress = 99;

        this.emitChange();
    }
    slidesProgress(res) {
        const noOfSlides = res.slides.length;
        if (this.noOfSlides < noOfSlides) {//no of slides has changed
            this.noOfSlides = noOfSlides;
            this.slides = res.slides;
            
            this.safetyCounter = 0;
            if (this.noOfSlides < this.totalNoOfSlides) {
                if (this.noOfSlides > 1) {//creation of slides started
                    // this.uploadProgress = 66 + 34 * (this.noOfSlides / this.totalNoOfSlides);
                    this.uploadProgress = this.uploadProgress + (100 - this.uploadProgress) * (this.noOfSlides / this.totalNoOfSlides);
                }
            } else {
                this.uploadProgress = 100;
            }
            
        } else {
            if (noOfSlides === 1 && this.safetyCounter % 5 === 0) {//still converting - increase progress
                this.uploadProgress += (65 - this.uploadProgress) / 3;
            }
            if (++this.safetyCounter > 200) {//100 times the call was made, and no change in noOfSlides
                this.uploadProgress = 100;
            }
        }

        this.emitChange();
    }
    thumbnailSuccess(payload) {
        let slideIndex = this.slides.findIndex((s) => {return (String(s.id) === String(payload.id));});
        if (slideIndex !== -1) {
            if (!this.slides[slideIndex].thumbnail) {
                this.slides[slideIndex].thumbnail = payload.thumbnail;
                console.log('!!!!!!!!!!!!!!!!! ', payload.id);
                this.emitChange();
            } 
        }
    }
    thumbnailFailed(payload) {
        let slideIndex = this.slides.findIndex((s) => {return (String(s.id) === String(payload.id));});
        if (slideIndex !== -1) {
            this.slides[slideIndex].thumbnail = undefined;//null means there is an ongoing request
            let currentNoOfFailedAttempts = this.slides[slideIndex].noOfThumbnailAttempts;
            console.log('Fail !!!!!!!! ', payload.id, currentNoOfFailedAttempts);  
            this.slides[slideIndex].noOfThumbnailAttempts = (currentNoOfFailedAttempts) ? ++currentNoOfFailedAttempts : 1;
            if (this.slides[slideIndex].noOfThumbnailAttempts < 10) {
                this.emitChange();
            }
        }
    }
}

ImportStore.storeName = 'ImportStore';
ImportStore.handlers = {
    'STORE_FILE': 'storeFile',
    'IMPORT_CANCELED': 'cancel',
    'IMPORT_FINISHED': 'destructor',
    'UPLOAD_FAILED': 'uploadFailed',
    'UPLOAD_SUCCESS': 'uploadSuccess',
    'UPLOAD_STARTED': 'uploadStarted',
    'UPLOAD_MORE_PROGRESS': 'uploadMoreProgress',
    'SLIDES_PROGRESS': 'slidesProgress',
    'THUMBNAIL_SUCCESS': 'thumbnailSuccess',
    'THUMBNAIL_FAILED': 'thumbnailFailed'
};

export default ImportStore;
