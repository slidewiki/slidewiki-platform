import {BaseStore} from 'fluxible/addons';

class PresentationStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.content = '';
        this.theme = '';
        this.selector = '';
        this.currentSlide = '';
    }

    updatePresentation(payload) {
        this.content = payload.content;
        this.theme = payload.theme;
        this.selector = payload.selector;
        this.emitChange();
    }
    updateTheme(theme) {
        //console.log('theme' + theme);
        this.theme = theme;
        this.emitChange();
    }

    getState() {
        return {
            items: this.items,
            selector: this.selector,
            mode: this.mode,
            content: this.content,
            theme: this.theme
        };
    }
    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.items = state.items;
        this.selector = state.selector;
        this.content = state.content;
        this.theme = state.theme;
    }

}

PresentationStore.storeName = 'PresentationStore';
PresentationStore.handlers = {
    'LOAD_PRESENTATION_SUCCESS': 'updatePresentation',
    'UPDATE_THEME': 'updateTheme'
};

export default PresentationStore;
