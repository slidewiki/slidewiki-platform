import {BaseStore} from 'fluxible/addons';

class MediaStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.status = '';
    }
    destructor()
    {
        this.status = '';
    }
    getState() {
        return {
            status: this.status
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.status = state.status;
    }

    startUploading() {
        this.status = 'uploading';
        this.emitChange();
    }
}

MediaStore.storeName = 'MediaStore';
MediaStore.handlers = {
    'START_UPLAODING_MEDIA_FILE': 'startUploading'
};

export default MediaStore;
