import {BaseStore} from 'fluxible/addons';

class MediaStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.status = '';
        this.filetype = '';
        this.filename = '';
        /*
        file looks like:
        {
            type: 'image/png',
            license: 'CC0',
            title: 'title',
            text: 'alternative text',
            filesize: 12873218637,
            filename: 'image.png',
            bytes: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4TRDRXhpZgAATU0AKgAAAAgACwEPAAIAAAAIAAAAkgEQAAIAA',
            url: 'https://fileservice.experimental.slidewiki.org/picture/fds243jsdalkfdsfdsfdsf.png',
            thumbnailUrl: 'https://fileservice.experimental.slidewiki.org/picture/fds243jsdalkfdsfdsfdsf_thumbnail.png'
        }
        */
        this.file = {};
    }
    destructor()
    {
        this.status = '';
        this.filetype = '';
        this.filename = '';
        this.file = {};
    }
    getState() {
        return {
            status: this.status,
            filetype: this.filetype,
            filename: this.filename,
            file: this.file
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.status = state.status;
        this.filetype = state.filetype;
        this.filename = state.filename;
        this.file = state.file;
    }

    startUploading(data) {
        this.status = 'uploading';
        this.filetype = data.type;
        this.filename = data.name;
        this.file = {};
        this.emitChange();
    }

    failureUpload(error) {
        this.status = 'error';
        this.emitChange();
    }

    successUpload(data) {
        // console.log('MediaStore: successUpload()', data);
        this.status = 'success';
        this.file = data;
        this.emitChange();
    }
}

MediaStore.storeName = 'MediaStore';
MediaStore.handlers = {
    'START_UPLOADING_MEDIA_FILE': 'startUploading',
    'FAILURE_UPLOADING_MEDIA_FILE': 'failureUpload',
    'SUCCESS_UPLOADING_MEDIA_FILE': 'successUpload'
};

export default MediaStore;
