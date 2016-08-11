import {BaseStore} from 'fluxible/addons';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.currentLang = {};
        this.error = '';
    }
    updateTranslations(payload) {
        this.translations = payload.translations;
        this.currentLang = payload.currentLang;
        this.emitChange();
    }
    getState() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            error: this.error,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.translations = state.translations;
        this.currentLang = state.currentLang;
        this.error = state.error;
    }
    handleDeckParamErrors(err) {
        this.error = err;
        this.emitChange();
    }

}

TranslationStore.storeName = 'TranslationStore';
TranslationStore.handlers = {
    'DECK_ERROR': 'handleDeckParamErrors',
    'SLIDE_ERROR': 'handleDeckParamErrors',
    'LOAD_TRANSLATIONS_SUCCESS': 'updateTranslations'
};

export default TranslationStore;
