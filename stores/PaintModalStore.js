import {BaseStore} from 'fluxible/addons';

class PaintModalStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.svg = '';
        this.toEdit = false;
        this.url = '';
    }
    destructor() {
        this.svg = '';
        this.toEdit = false;
        this.url = '';
    }
    getState() {
        return {
            svg: this.svg,
            toEdit: this.toEdit,
            url: this.url
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.svg = state.svg;
        this.svg = state.toEdit;
        this.url = state.url;
    }

    openWithSrc(params) {
        this.svg = params.svg;
        this.toEdit = true;
        this.url = params.url;
        this.emitChange();
    }

    finishEdition() {
        this.svg = '';
        this.toEdit = false;
        this.url = '';
        this.emitChange();
    }

}

PaintModalStore.storeName = 'PaintModalStore';

PaintModalStore.handlers =  {
    'OPEN_WITH_SRC': 'openWithSrc',
    'FINISH_EDITION': 'finishEdition'
};

export default PaintModalStore;
