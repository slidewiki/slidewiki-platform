import {BaseStore} from 'fluxible/addons';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.datasources = [];
    }
    updateTranslations(payload) {
        this.translations = payload.translations;
        this.emitChange();
    }
    getState() {
        return {
            translations: this.translations
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.translations = state.translations;
    }
}

TranslationStore.storeName = 'TranslationStore';
TranslationStore.handlers = {
    'LOAD_TRANSLATIONS_SUCCESS': 'updateTranslations'
};

export default TranslationStore;
