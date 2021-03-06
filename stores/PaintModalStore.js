import {BaseStore} from 'fluxible/addons';

class PaintModalStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.svg = '';
        this.toEdit = null; // Has 4 possible values. Null, Image, SVG and SVGFromImport
        this.url = '';
        this.title = '';
        this.altText = '';
    }
    destructor() {
        this.svg = '';
        this.toEdit = null;
        this.url = '';
        this.title = '';
        this.altText = '';
    }
    getState() {
        return {
            svg: this.svg,
            toEdit: this.toEdit,
            url: this.url,
            title: this.title,
            altText: this.altText
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.svg = state.toEdit;
        this.url = state.url;
        this.title = state.title;
        this.altText = state.altText;
    }

    openWithSrc(params) {
        this.svg = params.svg;
        this.toEdit = params.toEdit;
        this.url = params.url;
        this.title = params.title;
        this.altText = params.altText;
        this.emitChange();
    }

    finishEdition() {
        this.toEdit = null;
        this.url = '';
        this.svg = '';
        this.title = '';
        this.altText = '';
        this.emitChange();
    }

    openPicture(params) {
        this.svg = '';
        this.toEdit = 'Image';
        this.url = params.url;
        this.title = params.title;
        this.altText = params.altText;
        this.emitChange();
    }

}

PaintModalStore.storeName = 'PaintModalStore';

PaintModalStore.handlers =  {
    'OPEN_WITH_SRC': 'openWithSrc',
    'FINISH_EDITION': 'finishEdition',
    'OPEN_PICTURE': 'openPicture'
};

export default PaintModalStore;
