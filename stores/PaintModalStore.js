import {BaseStore} from 'fluxible/addons';

class PaintModalStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.svg = '';
        this.toEdit = false;
    }
    destructor() {
        this.svg = '';
    }
    getState() {
        return {
            svg: this.svg,
            toEdit: this.toEdit
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.svg = state.svg;
        this.svg = state.toEdit;
    }

    openWithSrc(svg) {
        this.svg = svg;
        this.toEdit = true;
        this.emitChange();
    }

}

PaintModalStore.storeName = 'PaintModalStore';

PaintModalStore.handlers =  {
    'OPEN_WITH_SRC': 'openWithSrc'
};

export default PaintModalStore;
