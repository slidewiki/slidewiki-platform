import {BaseStore} from 'fluxible/addons';

class SlideHistoryStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.slideId = '';
        this.changes = [];
    }

    loadSlideChanges(payload) {
        this.slideId = payload.slideId;
        this.changes = payload.changes;
        this.emitChange();
    }

    getState() {
        return {
            slideId: this.slideId,
            changes: this.changes
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.slideId = state.slideId;
        this.changes = state.changes;
    }
}

SlideHistoryStore.storeName = 'SlideHistoryStore';
SlideHistoryStore.handlers = {
    'LOAD_SLIDE_CHANGES_SUCCESS': 'loadSlideChanges'
};

export default SlideHistoryStore;
