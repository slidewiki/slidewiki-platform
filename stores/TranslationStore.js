import {BaseStore} from 'fluxible/addons';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.currentLang = {};
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
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.translations = state.translations;
        this.currentLang = state.currentLang;
    }

}

TranslationStore.storeName = 'TranslationStore';
TranslationStore.handlers = {
    'LOAD_TRANSLATIONS_SUCCESS': 'updateTranslations'
};

export default TranslationStore;
